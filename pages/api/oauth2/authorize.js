import OAuth2Server from '@node-oauth/oauth2-server';
import oauth, { model } from '../../../src/oauth/server';
import { SERVER_URL, WALLET_APP_URI } from '../../../src/config';
import getPageHTML from '../../../src/views/scan-qr';
import getErrorHTML from '../../../src/views/error';
import isValidAuthRequest from '../../../src/utils/request-validation';

import { decodeClientID } from '../../../src/utils/client-crypto';

function throwError(res, expectsHTML, errorMsg, url) {
  if (expectsHTML) {
    res.send(getErrorHTML(errorMsg, url));
  } else {
    res.status(400).send(errorMsg);
  }
}

export default async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  const acceptHeader = req.headers && req.headers.accept;
  const expectsHTML = acceptHeader && acceptHeader.indexOf('application/json') === -1;
  const clientId = req.query.client_id && req.query.client_id.replace(' ', '+');
  const scope = req.query.scope;
  const clientInfo = decodeClientID(clientId);

  if (!clientInfo) {
    return throwError(res, expectsHTML, 'Invalid client ID', req.query.redirect_uri);
  }

  if (clientInfo.redirectUri !== req.query.redirect_uri) {
    return throwError(res, expectsHTML, 'Invalid redirect URI', clientInfo.redirectUri);
  }

  // Ensure the request query is valid, otherwise show json/html error state
  if (!isValidAuthRequest(req)) {
    return throwError(res, expectsHTML, 'Not a valid auth request', clientInfo.redirectUri);
  }

  const vcSubmitId = clientId.substr(0, 8) + req.query.state;
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

    const submitUrl = `${SERVER_URL}/verify?id=${vcSubmitId}&scope=${scope}&client_name=${encodeURIComponent(
      clientInfo.name
    )}&client_website=${encodeURIComponent(clientInfo.website)}`;
    if (expectsHTML) {
      const deepLinkWrappedUrl = WALLET_APP_URI + encodeURIComponent(submitUrl);
      const html = await getPageHTML(req.query, deepLinkWrappedUrl, clientInfo);
      res.send(html);
    } else {
      res.json({ submitUrl });
    }
  }

  return true;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '800kb',
    },
  },
};
