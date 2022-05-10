import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';

import handleAuthorize from '../../../pages/api/oauth2/authorize';
import { WALLET_APP_URI, APP_STORE_URI, GPLAY_STORE_URI } from '../../../src/config';
import { authQueryProps, expectedSubmitUri } from './fixtures';
import { submitCredential } from './helpers';

jest.mock('memjs');

describe('API Route - /oauth2/authorize', () => {
  afterEach(() => {
    memjs.mockReset();
  });

  test('returns redirect URI after validation', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: authQueryProps,
    });

    await handleAuthorize(req, res);
    await submitCredential();

    const resultMock = createMocks({
      method: 'GET',
      query: authQueryProps,
    });
    await handleAuthorize(req, resultMock.res);

    expect(JSON.parse(resultMock.res._getData()).redirect).toBeDefined();
  });

  test('redirects request after validation', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        Accept: 'text/html',
      },
      query: authQueryProps,
    });

    await handleAuthorize(req, res);
    await submitCredential();

    const resultMock = createMocks({
      method: 'GET',
      query: authQueryProps,
    });
    await handleAuthorize(req, resultMock.res);

    expect(resultMock.res._getRedirectUrl()).toBeDefined();
  });

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

  // TODO: test and view for html error state
});
