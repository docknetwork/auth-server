import { createMocks } from 'node-mocks-http';

import handleIndex from '../../../pages/api/index';

describe('API Route - /', () => {
  test('status is good', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handleIndex(req, res);

    const result = JSON.parse(res._getData());
    expect(result.status).toEqual('good');
  });
});
