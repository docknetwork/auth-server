jest.mock('memjs');
import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';
import mockAxios from 'jest-mock-axios';

import handleAuthorize from '../../../pages/api/oauth2/authorize';
import handleVerify from '../../../pages/api/verify';
import {
  WALLET_APP_URI,
  APP_STORE_URI,
  GPLAY_STORE_URI,
  DOCK_API_VERIFY_URL,
} from '../../../src/config';
import { getMockCredential, authQueryProps, expectedSubmitUri, authStateID } from './fixtures';

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
    }
  }
}
