jest.mock('memjs');
import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';
import mockAxios from 'jest-mock-axios';

import handleUserInfo from '../../../pages/api/oauth2/userinfo';
import handleToken from '../../../pages/api/oauth2/token';

import { WALLET_APP_URI, APP_STORE_URI, GPLAY_STORE_URI } from '../../../src/config';
import { authQueryProps, expectedSubmitUri, getMockCredential, authStateID, defaultSubject } from './fixtures';
import { createAuthRequest, submitCredential, getAccessToken } from './helpers';

async function getToken(authParams) {
  const { req, res } = await getAccessToken(authParams);
  await handleToken(req, res);

  const tokenData = await JSON.parse(res._getData());
  return tokenData.access_token;
}

describe('API Route - /oauth2/userinfo', () => {
  let authParams;

  afterEach(() => {
    memjs.mockReset();
  });

  beforeEach(async () => {
    await createAuthRequest();
    await submitCredential();
    authParams = await createAuthRequest();
  });

  test('retrieves user info with valid access token', async () => {
    const accessToken = await getToken(authParams);
    expect(accessToken).toBeDefined();

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        access_token: accessToken,
      },
    });

    await handleUserInfo(req, res);

    const profile = JSON.parse(res._getData());
    expect(profile.name).toEqual(defaultSubject.name);
    expect(profile.email).toEqual(defaultSubject.email);
  });
});
