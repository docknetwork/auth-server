const memjs = jest.createMockFromModule('memjs');

class MockClient {
  constructor() {
    this.get = jest.fn(this.mockGet.bind(this));
    this.set = jest.fn(this.mockSet.bind(this));
    this.store = {};
  }

  mockGet(id) {
    return {
      value: this.store[id],
    };
  }

  mockSet(id, value) {
    this.store[id] = value;
  }

  reset() {
    this.store = {};
  }
}

const client = new MockClient();

memjs.Client = {
  create: jest.fn(() => client),
};

memjs.mockReset = () => {
  client.reset();
};

module.exports = memjs;
