jest.mock('memjs');
import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';
import mockAxios from 'jest-mock-axios';

import handleAuthorize from '../../../pages/api/oauth2/authorize';
import handleToken from '../../../pages/api/oauth2/token';
import handleVerify from '../../../pages/api/verify';

import { WALLET_APP_URI, APP_STORE_URI, GPLAY_STORE_URI } from '../../../src/config';
import { authQueryProps, expectedSubmitUri, getMockCredential, authStateID } from './fixtures';
import { createAuthRequest, submitCredential, getAccessToken } from './helpers';

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
    const { req, res } = await getAccessToken(authParams);
    await handleToken(req, res);

    const tokenData = await JSON.parse(res._getData());
    expect(tokenData.access_token).toBeDefined();
    expect(tokenData.token_type).toBeDefined();
    expect(tokenData.expires_in).toBeDefined();
    expect(tokenData.refresh_token).toBeDefined();
  });
});
