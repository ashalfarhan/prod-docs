import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { getAccessTokenURL, getAuthorizeURL } from './github';
import { Env, GitHubTokenResponse } from './types';

const app = new Hono<{ Bindings: Env }>();

app.get('/', c => c.text('Hello!'));

app.get('/auth', c => {
  const { origin } = new URL(c.req.url);
  const url = getAuthorizeURL({
    clientId: c.env.OAUTH_CLIENT_ID,
    redirectUri: origin + '/callback',
    state: nanoid(),
    scope: c.env.OAUTH_SCOPES,
  });
  return c.redirect(url.toString());
});

function renderBody(
  status: string,
  content: {
    token: string;
    provider: string;
  }
) {
  return `
      <script>
        if (!window.opener) {
          console.log("Cannot find parent!");
          window.opener = {};
        }
        if (!window.opener.postMessage) {
          window.opener.postMessage = (action, data) => {
            console.log({ action, data });
          };
        }
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:${content.provider}:${status}:${JSON.stringify(
    content
  )}',
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:${content.provider}", "*");
      </script>
    `;
}

app.get('/callback', async c => {
  const code = c.req.query('code');
  const state = c.req.queries('state');
  try {
    if (!code || !state) throw new Error('Missing code and/or state');
    const url = getAccessTokenURL({
      clientId: c.env.OAUTH_CLIENT_ID,
      clientSecret: c.env.OAUTH_CLIENT_SECRET,
      code,
    });
    const response = await fetch(url, {
      method: 'POST',
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to request access token: ' + response.status);
    }
    const res: GitHubTokenResponse = await response.json();
    return c.html(
      renderBody('success', { provider: 'github', token: res.access_token })
    );
  } catch (error) {
    return c.html(renderBody('error', error));
  }
});

app.onError((err, c) => {
  console.error('App encountered an error:', { err });
  return c.text('Something went wrong, check the logs', 500);
});

export default app;
