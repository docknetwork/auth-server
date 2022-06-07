import mockAxios from 'jest-mock-axios';
import { ensureAuthCredential, postVerify } from '../../../src/utils/verify-credential';
import { DOCK_API_VERIFY_URL } from '../../../src/config';

const credentialId = 'credential:auth';
const credential = {
  type: ['VerifiableCredential', 'DockAuthCredential'],
  credentialSubject: {
    state: credentialId,
  },
};

describe('Utils - postVerify', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('requests credential veriifcation and returns true if successful', async () => {
    const promise = postVerify(credential);
    mockAxios.mockResponse({ data: { verified: true } });
    const [result, error] = await promise;

    expect(result).toBe(true);
    expect(error).toBe(null);
    expect(mockAxios.post).toHaveBeenCalledWith(DOCK_API_VERIFY_URL, credential, {
      headers: {
        'DOCK-API-TOKEN': undefined,
      },
    });
  });

  test('requests credential veriifcation and returns false if unsuccessful', async () => {
    const promise = postVerify(credential);
    mockAxios.mockResponse({ data: { verified: false } });
    const [result, error] = await promise;

    expect(result).toBe(false);
    expect(error).toBeDefined();
    expect(mockAxios.post).toHaveBeenCalledWith(DOCK_API_VERIFY_URL, credential, {
      headers: {
        'DOCK-API-TOKEN': undefined,
      },
    });
  });

  test('returns false if theres an error', async () => {
    const promise = postVerify(credential);
    mockAxios.mockError();
    const [result, error] = await promise;
    expect(result).toBe(false);
    expect(error).toBeDefined();
  });
});

describe('Utils - ensureAuthCredential', () => {
  test('throws error for wrong credential type', () => {
    expect(() =>
      ensureAuthCredential(credentialId, {
        ...credential,
        type: ['VerifiableCredential'],
      })
    ).toThrow('Wrong credential type');

    expect(() =>
      ensureAuthCredential(credentialId, {
        ...credential,
        type: undefined,
      })
    ).toThrow('Wrong credential type');
  });

  test('throws error for array subject', () => {
    expect(() =>
      ensureAuthCredential(credentialId, {
        ...credential,
        credentialSubject: [{}],
      })
    ).toThrow('Subject cannot be array');
  });

  test('throws error for non-object subject', () => {
    expect(() =>
      ensureAuthCredential(credentialId, {
        ...credential,
        credentialSubject: 'string',
      })
    ).toThrow('Subject must be object');
  });

  test('throws error for no state in subject', () => {
    expect(() =>
      ensureAuthCredential(credentialId, {
        ...credential,
        credentialSubject: {
          noState: true,
        },
      })
    ).toThrow('Subject requires state');
  });

  test('throws error for mismatching state vs id', () => {
    expect(() =>
      ensureAuthCredential(credentialId, {
        ...credential,
        credentialSubject: {
          state: 'wrong state',
        },
      })
    ).toThrow('State mismatch');
  });

  test('happy path', () => {
    expect(() =>
      ensureAuthCredential(credentialId, {
        ...credential,
      })
    ).not.toThrow();
  });
});
