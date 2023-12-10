// see: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
export function getAuthorizeURL({
  clientId = '',
  redirectUri = '',
  // see: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes
  scope = '',
  state = '',
}) {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);
  return url;
}

// see: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
export function getAccessTokenURL({
  clientId = '',
  clientSecret = '',
  code = '',
}) {
  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('code', code);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('client_secret', clientSecret);
  return url;
}
