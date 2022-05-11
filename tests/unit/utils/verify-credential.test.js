import { ensureAuthCredential } from '../../../src/utils/verify-credential';

const credentialId = 'credential:auth';
const credential = {
 type: ['VerifiableCredential', 'DockAuthCredential'],
 credentialSubject: {
   state: credentialId,
 },
};

describe('Utils - ensureAuthCredential', () => {
  test('throws error for wrong credential type', () => {
    expect(() => ensureAuthCredential(credentialId, {
      ...credential,
      type: ['VerifiableCredential'],
    })).toThrow('Wrong credential type');

    expect(() => ensureAuthCredential(credentialId, {
      ...credential,
      type: undefined,
    })).toThrow('Wrong credential type');
  });

  test('throws error for array subject', () => {
    expect(() => ensureAuthCredential(credentialId, {
      ...credential,
      credentialSubject: [{}],
    })).toThrow('Subject cannot be array');
  });

  test('throws error for non-object subject', () => {
    expect(() => ensureAuthCredential(credentialId, {
      ...credential,
      credentialSubject: 'string',
    })).toThrow('Subject must be object');
  });

  test('throws error for no state in subject', () => {
    expect(() => ensureAuthCredential(credentialId, {
      ...credential,
      credentialSubject: {
        noState: true,
      },
    })).toThrow('Subject requires state');
  });

  test('throws error for mismatching state vs id', () => {
    expect(() => ensureAuthCredential(credentialId, {
      ...credential,
      credentialSubject: {
        state: 'wrong state',
      },
    })).toThrow('State mismatch');
  });

  test('happy path', () => {
    expect(() => ensureAuthCredential(credentialId, {
      ...credential,
    })).not.toThrow();
  });
});
