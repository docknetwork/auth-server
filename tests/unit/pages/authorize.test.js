import { createMocks } from 'node-mocks-http';
import handleAuthorize from '../../../pages/api/oauth2/authorize';

import { SERVER_URL, WALLET_APP_URI, APP_STORE_URI, GPLAY_STORE_URI } from '../../../src/config';

const authQueryProps = {
  response_type: 'code',
  redirect_uri: 'https://dev-a3auqqdy.us.auth0.com/login/callback&scope=public',
  state: 'LDO-aLl19QgZ4ZcdSj3EQMYDziuYUnAj',
  client_id: 'dockstagingtest',
  prompt: 'login',
};

const expectedSubmitUri =
  SERVER_URL + `/verify?id=${authQueryProps.client_id}${authQueryProps.state}`;

describe('API Route - /oauth2/authorize', () => {
  test('returns error with invalid state', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        ...authQueryProps,
        state: undefined,
        client_id: undefined,
        response_type: undefined,
        redirect_uri: undefined,
      },
    });

    await handleAuthorize(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toBeDefined();
  });

  test('returns JSON with submit URI when requesting JSON', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: authQueryProps,
    });

    await handleAuthorize(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        submitUrl: expectedSubmitUri,
      })
    );
  });

  test('returns a HTML page that contains QR code, auth button and app store links', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        Accept: 'text/html',
      },
      query: authQueryProps,
    });

    await handleAuthorize(req, res);

    expect(res._getStatusCode()).toBe(200);
    const html = res._getData();

    const body = document.createElement('div');
    body.innerHTML = html;

    const loginLink = body.querySelector('.submit-btn');
    expect(loginLink.getAttribute('href')).toBe(
      WALLET_APP_URI + encodeURIComponent(expectedSubmitUri)
    );
    expect(body.querySelector('img[alt=qr-code]')).toBeDefined();

    const appStoreLink = body.querySelectorAll('.get-wallet-buttons > a')[0];
    const gplayStoreLink = body.querySelectorAll('.get-wallet-buttons > a')[1];
    expect(appStoreLink.getAttribute('href')).toBe(APP_STORE_URI);
    expect(gplayStoreLink.getAttribute('href')).toBe(GPLAY_STORE_URI);
  });
});
