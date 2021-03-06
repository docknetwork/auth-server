import { createMocks } from 'node-mocks-http';
import mockAxios from 'jest-mock-axios';

import handleAuthorize from '../../../pages/api/oauth2/authorize';
import handleVerify from '../../../pages/api/verify';
import { getMockCredential, authQueryProps, authStateID } from './fixtures';

export async function getAccessToken(authParams) {
  const { req, res } = createMocks({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'transfer-encoding': 'chunked',
    },
    body: {
      client_id: authQueryProps.client_id,
      client_secret: authQueryProps.client_secret,
      redirect_uri: authQueryProps.redirect_uri,
      grant_type: 'authorization_code',
      scope: 'public',
      ...authParams,
    },
  });

  return { req, res };
}

export async function submitCredential(verified = true) {
  const { req, res } = createMocks({
    method: 'POST',
    query: {
      id: authStateID,
    },
    body: {
      vc: getMockCredential(authStateID),
    },
  });

  const promise = handleVerify(req, res);

  // Mock response for credential verification
  setTimeout(() => {
    mockAxios.mockResponse({ data: { verified } });
  }, 500);

  await promise;
}

export async function createAuthRequest() {
  const { req, res } = createMocks({
    method: 'GET',
    query: authQueryProps,
  });
  await handleAuthorize(req, res);

  const data = JSON.parse(res._getData());
  if (data.redirect) {
    const redirectURL = new URL(data.redirect);
    return {
      code: redirectURL.searchParams.get('code'),
      state: redirectURL.searchParams.get('state'),
    };
  }

  return {};
}
