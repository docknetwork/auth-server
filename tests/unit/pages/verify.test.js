jest.mock('memjs');
import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';
import mockAxios from 'jest-mock-axios';

import handleAuthorize from '../../../pages/api/oauth2/authorize';
import handleVerify from '../../../pages/api/verify';
import { WALLET_APP_URI, APP_STORE_URI, GPLAY_STORE_URI, DOCK_API_VERIFY_URL } from '../../../src/config';
import { authQueryProps, expectedSubmitUri, authStateID } from './fixtures';

function getMockCredential(state) {
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        dk: 'https://ld.dock.io/credentials#',
        DockAuthCredential: 'dk:DockAuthCredential',
        name: 'dk:name',
        email: 'dk:email',
        state: 'dk:state',
      },
    ],
    id: 'didauth:dock:clientid',
    type: ['VerifiableCredential', 'DockAuthCredential'],
    credentialSubject: {
      name: 'John Doe',
      email: 'test@dock.io',
      state,
    },
    issuanceDate: '2022-04-01T18:26:21.637Z',
    expirationDate: '2025-04-01T18:26:21.637Z',
    proof: {
      type: 'Sr25519Signature2020',
      created: '2022-05-06T21:57:17Z',
      verificationMethod: 'did:dock:5HPgr7Wgd6RK9LfRwAbqrgfogSqypVuAYwuAi6jnstLAkAyH#keys-1',
      proofPurpose: 'assertionMethod',
      proofValue:
        'z3HDwoXLbwANagGF2wePVvbb4rWi852yvE6a6NQxXxE9hk1q1CT8FZnYuY9LEL6BCpQJKDrvUVv1MwXFx1dG8vfJw',
    },
    issuer: 'did:dock:5HPgr7Wgd6RK9LfRwAbqrgfogSqypVuAYwuAi6jnstLAkAyH',
  };
}

async function createAuthRequest() {
  const { req, res } = createMocks({
    method: 'GET',
    query: authQueryProps,
  });
  await handleAuthorize(req, res);
  console.log(JSON.parse(res._getData()));
}

describe('API Route - /oauth2/authorize', () => {
  afterEach(() => {
    mockAxios.reset();
    memjs.mockClear();
  });

  test('verifies a valid auth credential', async () => {
    await createAuthRequest();
    const vc = getMockCredential(authStateID);
    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: authStateID,
      },
      body: {
        vc,
      },
    });

    const promise = handleVerify(req, res);

    // Mock response for credential verification
    setTimeout(() => {
      mockAxios.mockResponse({ data: { verified: true } });
    }, 500);

    await promise;

    expect(mockAxios.post).toHaveBeenCalledWith(DOCK_API_VERIFY_URL, vc, {
      headers: {
        'DOCK-API-TOKEN': undefined,
      },
    });

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).verified).toEqual(true);
  });
});
