import getErrorHTML from '../../../src/views/error';

describe('Views - Error state', () => {
  test('shows title, default message and default back link', () => {
    const html = getErrorHTML();
    const body = document.createElement('div');
    body.innerHTML = html;
    expect(body.querySelector('h1').innerHTML.trim()).toEqual('Something went wrong');
    expect(body.querySelector('p').innerHTML.trim()).toEqual('Unknown error');
    expect(body.querySelector('a').getAttribute('href')).toEqual('https://dock.io');
  });

  test('shows custom message and default redirect url', () => {
    const html = getErrorHTML('my message');
    const body = document.createElement('div');
    body.innerHTML = html;
    expect(body.querySelector('p').innerHTML.trim()).toEqual('my message');
    expect(body.querySelector('a').getAttribute('href')).toEqual('https://dock.io');
  });

  test('shows custom message and redirect url', () => {
    const html = getErrorHTML('my message', 'http://back.com');
    const body = document.createElement('div');
    body.innerHTML = html;
    expect(body.querySelector('p').innerHTML.trim()).toEqual('my message');
    expect(body.querySelector('a').getAttribute('href')).toEqual('http://back.com');
  });
});
