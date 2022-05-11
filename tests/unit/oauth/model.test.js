import memjs from 'memjs';
import MemcachedOAuthModel from '../../../src/oauth/model';

jest.mock('memjs');

describe('Oauth Memcached Model', () => {
  const model = new MemcachedOAuthModel();

  afterEach(() => {
    memjs.mockReset();
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
