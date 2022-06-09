import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';

import handleUserInfo from '../../../pages/api/oauth2/userinfo';
import handleToken from '../../../pages/api/oauth2/token';

import { createAuthRequest, submitCredential, getAccessToken } from './helpers';
import { defaultSubject } from './fixtures';

jest.mock('memjs');

async function getToken(authParams) {
  const { req, res } = await getAccessToken(authParams);
  await handleToken(req, res);

  const tokenData = JSON.parse(res._getData());
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

  test('error state', async () => {
    const accessToken = await getToken(authParams);
    expect(accessToken).toBeDefined();

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        access_token: null,
      },
    });

    await handleUserInfo(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toEqual('Unauthorized request: no authentication given');
  });
});
