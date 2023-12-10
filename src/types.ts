export type Env = {
  OAUTH_SCOPES: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  REDIRECT_URI: string;
};

export type GitHubTokenResponse = {
  access_token: string;
  scope: string;
  token_type: string;
};
