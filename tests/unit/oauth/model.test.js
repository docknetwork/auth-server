import memjs from 'memjs';
import MemcachedOAuthModel from '../../../src/oauth/model';
import { encodeClientId } from '../../../src/utils/client-crypto';

jest.mock('memjs');

describe('Oauth Memcached Model', () => {
  const model = new MemcachedOAuthModel();

  afterEach(() => {
    memjs.mockReset();
  });

  test('invalid getClient returns false', async () => {
    expect(await model.getClient('invalidid')).toEqual(false);
    expect(
      await model.getClient(
        encodeClientId({ name: 'test', website: 'https://t.com', redirect_uris: ['t://t'] }),
        'invalidsecret'
      )
    ).toEqual(false);
  });

  test('getUser returns false', async () => {
    expect(await model.getUser()).toEqual(false);
  });

  test('getRefreshToken returns false', async () => {
    expect(await model.getRefreshToken('code')).toEqual(false);
  });

  test('getAuthorizationCode returns false when its not valid', async () => {
    expect(await model.getAuthorizationCode('code')).toEqual(false);
  });

  test('completeVCCheck returns false when its not valid', async () => {
    expect(await model.completeVCCheck('id', {})).toEqual(false);
  });

  test('getAccessToken returns false when its not valid', async () => {
    expect(await model.getAccessToken('code')).toEqual(false);
  });

  test('set accepts null value', async () => {
    expect(await model.set('type', 'id', null)).toBeDefined();
  });
});
