import memjs from 'memjs';
import { createMocks } from 'node-mocks-http';

import handleRegister from '../../../pages/api/register';

jest.mock('memjs');

const registerOptions = {
  redirect_uris: ['http://localhost:3000/login/callback'],
  name: 'Test App',
  website: 'http://localhost:3000',
};

describe('API Route - /register', () => {
  afterEach(() => {
    memjs.mockReset();
  });

  test('can register a new client to get id and secret', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: registerOptions,
    });

    await handleRegister(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);

    const data = JSON.parse(res._getData());
    expect(data.client_id).toBeDefined();
    expect(data.client_secret).toBeDefined();
  });

  test('only POST method is supported', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  test('can not register with no parameters', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        redirect_uris: [],
        name: '',
        website: '',
      },
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  test('can not register with invalid redirect_uris (not an array)', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ...registerOptions,
        redirect_uris: 'astring',
      },
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  test('can not register with invalid redirect_uris (not a uri)', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ...registerOptions,
        redirect_uris: ['astring'],
      },
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  test('can not register with invalid redirect_uris (multiple)', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ...registerOptions,
        redirect_uris: ['http://localhost', 'https://dock.io'],
      },
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  test('can not register with invalid website', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ...registerOptions,
        website: 'notauri',
      },
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
});
