import OAuth2Server from '@node-oauth/oauth2-server';
import oauth, { model } from '../../../src/oauth/server';
import { WALLET_APP_URI } from '../../../src/config';
import getPageHTML from '../../../src/views/scan-qr';

const SERVER_URL = process.env.SERVER_URL || process.env.VERCEL_URL || 'http://localhost:3000';

export default async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  const acceptHeader = req.headers && req.headers.accept;
  const expectsHTML = acceptHeader && acceptHeader.indexOf('text/html') !== -1;
  const vcSubmitId = req.query.client_id + req.query.state;

  const currentVCCheck = await model.getVCCheck(vcSubmitId);
  if (currentVCCheck && currentVCCheck.user) {
    request.query.access_token = currentVCCheck.id;
    await oauth.authorize(request, response);
    const redirectTo = response.headers.location;
    if (expectsHTML) {
      res.redirect(redirectTo);
    } else {
      res.json({ redirect: redirectTo });
    }
  } else {
    if (!currentVCCheck) {
      await model.insertVCCheck(vcSubmitId, req.query.state);
    }

    const submitUrl = `${SERVER_URL}/verify?id=${vcSubmitId}`;
    if (expectsHTML) {
      const deepLinkWrappedUrl = WALLET_APP_URI + encodeURIComponent(submitUrl);
      const html = await getPageHTML(req.query, deepLinkWrappedUrl);
      res.send(html);
    } else {
      res.json({ submitUrl });
    }
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '800kb',
    },
  },
};
