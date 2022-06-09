import isValidHttpUrl from '../../../src/utils/valid-url';

describe('Utils - isValidHttpUrl', () => {
  test('isValidHttpUrl happy path', () => {
    expect(isValidHttpUrl('http://google.com')).toEqual(true);
    expect(isValidHttpUrl('https://google.com')).toEqual(true);
    expect(isValidHttpUrl('https://localhost')).toEqual(true);
    expect(isValidHttpUrl('https://localhost:3000')).toEqual(true);
    expect(isValidHttpUrl('https://dock.io/login/auth/callback')).toEqual(true);
  });

  test('isValidHttpUrl sad path', () => {
    expect(isValidHttpUrl('did:dock:xyz')).toEqual(false);
    expect(isValidHttpUrl('notaurl')).toEqual(false);
  });
});
