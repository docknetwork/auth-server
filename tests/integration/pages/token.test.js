jest.mock('memjs');
import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';
import mockAxios from 'jest-mock-axios';

import handleAuthorize from '../../../pages/api/oauth2/authorize';
import handleToken from '../../../pages/api/oauth2/token';
import handleVerify from '../../../pages/api/verify';

import { WALLET_APP_URI, APP_STORE_URI, GPLAY_STORE_URI } from '../../../src/config';
import { authQueryProps, expectedSubmitUri, getMockCredential, authStateID } from './fixtures';
import { createAuthRequest, submitCredential } from './helpers';

describe('API Route - /oauth2/token', () => {
  let authParams;

  afterEach(() => {
    memjs.mockReset();
  });

  beforeEach(async () => {
    await createAuthRequest();
    await submitCredential();
    authParams = await createAuthRequest();
  });

  test('receives a valid code and returns an auth token', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'transfer-encoding': 'chunked',
      },
      body: {
        ...authParams,
        client_id: authQueryProps.client_id,
        client_secret: 'secret:' + authQueryProps.client_id,
        redirect_uri: authQueryProps.redirect_uri,
        grant_type: 'authorization_code',
        scope: 'public',
      },
    });

    await handleToken(req, res);

    const tokenData = JSON.parse(res._getData());
    expect(tokenData.access_token).toBeDefined();
    expect(tokenData.token_type).toBeDefined();
    expect(tokenData.expires_in).toBeDefined();
    expect(tokenData.refresh_token).toBeDefined();
  });
});
