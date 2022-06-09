import sanitize from '../../../src/utils/sanitize';

describe('Utils - sanitize', () => {
  test('sanitizes html', () => {
    expect(sanitize('&')).toEqual('&amp;');
    expect(sanitize('<')).toEqual('&lt;');
    expect(sanitize('>')).toEqual('&gt;');
  });

  test('sanitizes quotes', () => {
    expect(sanitize('"')).toEqual('&quot;');
    expect(sanitize("'")).toEqual('&#039;');
  });

  test('doesnt sanitize non-strings', () => {
    expect(sanitize({})).toEqual('');
    expect(sanitize(null)).toEqual('');
  });
});
