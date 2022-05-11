import OAuth2Server from '@node-oauth/oauth2-server';
import oauth, { model } from '../../../src/oauth/server';
import { SERVER_URL, WALLET_APP_URI } from '../../../src/config';
import getPageHTML from '../../../src/views/scan-qr';
import getErrorHTML from '../../../src/views/error';
import { isValidAuthRequest } from '../../../src/utils/request-validation';

export default async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  const acceptHeader = req.headers && req.headers.accept;
  const expectsHTML = acceptHeader && acceptHeader.indexOf('application/json') === -1;
  const vcSubmitId = req.query.client_id + req.query.state;

  // Ensure the request query is valid, otherwise show json/html error state
  if (!isValidAuthRequest(req)) {
    const errorMsg = 'Not a valid auth request';
    if (expectsHTML) {
      res.send(getErrorHTML(errorMsg, req.query.redirect_uri));
    } else {
      res.status(400).json({ error: errorMsg });
    }
    return;
  }

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
