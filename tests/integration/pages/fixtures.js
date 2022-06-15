import { SERVER_URL } from '../../../src/config';
import { encodeClientId, createClientSecret } from '../../../src/utils/client-crypto';

export const clientInfo = {
  name: 'Test App',
  website: 'http://localhost:3000',
  redirect_uris: ['http://localhost:3000/login/callback'],
};

const clientId = encodeClientId(clientInfo);

export const authQueryProps = {
  response_type: 'code',
  redirect_uri: 'http://localhost:3000/login/callback',
  state: 'LAO-aLl19QgZ4ZcdSj3EQMYDziuYUnAj',
  client_id: clientId,
  prompt: 'login',
  scope: 'public',
  client_secret: createClientSecret(clientId),
};

export const authStateID = `${authQueryProps.client_id.substr(0, 8)}${authQueryProps.state}`;

export const expectedSubmitUri = `${SERVER_URL}/verify?id=${authStateID}&scope=public&client_name=${encodeURIComponent(clientInfo.name)}&client_website=${encodeURIComponent(clientInfo.website)}`;

export const defaultSubject = {
  name: 'John Doe',
  email: 'test@dock.io',
};

export const issuer = 'did:dock:5HPgr7Wgd6RK9LfRwAbqrgfogSqypVuAYwuAi6jnstLAkAyH';

export function getMockCredential(state) {
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
      ...defaultSubject,
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
    issuer,
  };
}
