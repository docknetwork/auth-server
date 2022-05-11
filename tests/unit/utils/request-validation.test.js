import { isValidAuthRequest } from '../../../src/utils/request-validation';

const validQuery = {
  state: 'defined',
  client_id: '123',
  response_type: 'code',
  redirect_uri: 'http://dock.io',
};

describe('Utils - isValidAuthRequest', () => {
  test('returns true for a valid auth request', () => {
    expect(isValidAuthRequest({
      query: validQuery,
    })).toEqual(true);
  });

  test('returns false for no query', () => {
    expect(isValidAuthRequest({})).toEqual(false);
  });

  test('returns false for undefined state', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        state: undefined,
      },
    })).toEqual(false);
  });

  test('returns false for undefined client_id', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        client_id: undefined,
      },
    })).toEqual(false);
  });

  test('returns false for undefined response_type', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        response_type: undefined,
      },
    })).toEqual(false);
  });

  test('returns false for undefined redirect_uri', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        redirect_uri: undefined,
      },
    })).toEqual(false);
  });

  test('returns false for non-string state', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        state: { object: true },
      },
    })).toEqual(false);
  });

  test('returns false for non-string client_id', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        client_id: { object: true },
      },
    })).toEqual(false);
  });

  test('returns false for non-string response_type', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        response_type: { object: true },
      },
    })).toEqual(false);
  });

  test('returns false for non-string redirect_uri', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        redirect_uri: { object: true },
      },
    })).toEqual(false);
  });

  test('returns false for invalid response type', () => {
    expect(isValidAuthRequest({
      query: {
        ...validQuery,
        response_type: 'token',
      },
    })).toEqual(false);
  });
});
