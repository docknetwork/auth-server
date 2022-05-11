import OAuth2Server from '@node-oauth/oauth2-server';
import oauth from '../../../src/oauth/server';

export default async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  await oauth.token(request, response);
  res.json(response.body);
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
      responseLimit: '1mb',
    },
  },
};
