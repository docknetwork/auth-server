import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';
import mockAxios from 'jest-mock-axios';

import handleVerify from '../../../pages/api/verify';
import { DOCK_API_VERIFY_URL } from '../../../src/config';

import { getMockCredential, authStateID, issuer } from './fixtures';
import { createAuthRequest } from './helpers';

jest.mock('memjs');

describe('API Route - /oauth2/verify', () => {
  afterEach(() => {
    mockAxios.reset();
    memjs.mockReset();
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

    // Expect first time request returns successful
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).verified).toEqual(true);
    expect(JSON.parse(res._getData()).userId).toEqual(issuer);

    // Expect that trying to verify again will return an error
    await handleVerify(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  test('verifies a valid auth credential with issuer as object', async () => {
    await createAuthRequest();
    const vc = getMockCredential(authStateID);
    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: authStateID,
      },
      body: {
        vc: {
          ...vc,
          issuer: {
            id: vc.issuer,
          },
        },
      },
    });

    const promise = handleVerify(req, res);

    // Mock response for credential verification
    setTimeout(() => {
      mockAxios.mockResponse({ data: { verified: true } });
    }, 500);

    await promise;

    // Expect first time request returns successful
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).verified).toEqual(true);
    expect(JSON.parse(res._getData()).userId).toEqual(issuer);
  });

  test('rejects an invalid auth credential', async () => {
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
      mockAxios.mockResponse({ data: { verified: false } });
    }, 500);

    await promise;

    expect(mockAxios.post).toHaveBeenCalledWith(DOCK_API_VERIFY_URL, vc, {
      headers: {
        'DOCK-API-TOKEN': undefined,
      },
    });

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).verified).toEqual(false);
  });

  test('rejects a non-auth credential', async () => {
    await createAuthRequest();
    const vc = getMockCredential(authStateID);
    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: authStateID,
      },
      body: {
        vc: {
          ...vc,
          type: ['VerifiableCredential'],
          credentialSubject: {
            name: 'John Doe',
          },
        },
      },
    });

    await handleVerify(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toBeDefined();
  });

  test('rejects missing post body', async () => {
    await createAuthRequest();
    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: authStateID,
      },
      body: {},
    });

    await handleVerify(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toEqual('Missing or invalid post body');
  });

  test('rejects missing ID', async () => {
    await createAuthRequest();
    const vc = getMockCredential(authStateID);
    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: null,
      },
      body: { vc },
    });

    await handleVerify(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toEqual('Missing or invalid post body');
  });

  test('rejects non-POST request', async () => {
    await createAuthRequest();
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: authStateID,
      },
    });

    await handleVerify(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData()).error).toEqual('Missing or invalid post body');
  });
});
