import {
  encodeClientId,
  createClientSecret,
  isValidClientSecret,
  getHash,
  cleanInput,
  decodeClientID,
  encrypt,
  CLIENT_ID_PREFIX,
} from '../../../src/utils/client-crypto';

const CRYPTO_KEY = process.env.CRYPTO_KEY || '6352e481f4338d176352e481f4338d17';

describe('Utils - client crypto', () => {
  let clientId;
  let clientSecret;
  beforeAll(() => {
    clientId = encodeClientId({ name: 'test', website: 'https://t.com', redirect_uris: ['t://t'] });
    clientSecret = createClientSecret(clientId);
  });

  test('decodeClientID works', () => {
    expect(!!decodeClientID(clientId)).toEqual(true);
    expect(!!decodeClientID(encrypt('thisisaninvalidclientid', CRYPTO_KEY))).toEqual(false);
    expect(
      !!decodeClientID(encrypt(`${CLIENT_ID_PREFIX}thisisaninvalidclientid`, CRYPTO_KEY))
    ).toEqual(false);
  });

  test('isValidClientSecret works', () => {
    expect(isValidClientSecret(clientId, clientSecret)).toEqual(true);
    expect(isValidClientSecret('invalidclientid', clientSecret)).toEqual(false);
    expect(isValidClientSecret(clientId, 'non encrypted client secret')).toEqual(false);
    expect(
      isValidClientSecret(clientId, encrypt('thisisaninvalidclientsecret', CRYPTO_KEY))
    ).toEqual(false);
    expect(
      isValidClientSecret(
        clientId,
        '3ToCiUksf0JpfccX6P4RYfcXgHO2vNML2dhbNPWf6QxT9taLDEbbw6cGObrYqc9'
      )
    ).toEqual(false);
  });

  test('getHash works', () => {
    expect(getHash('test')).toEqual('098f6bcd4621d373cade4e832627b4f6');
  });

  test('cleanInput works', () => {
    expect(cleanInput('a\nb\nc')).toEqual('abc');
    expect(cleanInput('a\n b\nc  ')).toEqual('a bc');
  });
});
