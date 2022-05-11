import memjs from 'memjs';

import handleToken from '../../../pages/api/oauth2/token';
import { createAuthRequest, submitCredential, getAccessToken } from './helpers';

jest.mock('memjs');

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
