export class MockClient {
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
}

export const Client = {
  create: jest.fn(() => new MockClient()),
};

const mock = jest.fn().mockImplementation(() => {
  return { Client };
});

export default mock;
