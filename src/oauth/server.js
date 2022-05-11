import OAuth2Server from '@node-oauth/oauth2-server';
import { TOKEN_TTL } from '../config';
import MemcachedOAuthModel from './model';

// Using globals here for nextjs dev mode reloads
if (!global.authModel) {
  global.authModel = new MemcachedOAuthModel();
}

export const model = global.authModel;

if (!global.oauthServer) {
  global.oauthServer = new OAuth2Server({
    model: global.authModel,
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: TOKEN_TTL,
    refreshTokenLifetime: TOKEN_TTL,
    allowExtendedTokenAttributes: false,
  });
}

export default global.oauthServer;
