const fetchUserProfile = require("./fetchUserProfile");

const defaultContext = {};

describe("fetchUserProfile", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("request.get options", () => {
    beforeEach(() => {
      global.request = { get: jest.fn() };
      fetchUserProfile("__test_access_token__", defaultContext, jest.fn());
    });

    it("should call request.get", () => {
      expect(global.request.get).toHaveBeenCalledTimes(1);
    });

    it("should get the correct endpoint", () => {
      expect(global.request.get.mock.calls[0][0].url).toEqual(
        "https://auth.dock.io/oauth2/userinfo"
      );
    });

    it("should use the passed-in access token", () => {
      expect(global.request.get.mock.calls[0][0].headers).toMatchObject({
        Authorization: "Bearer __test_access_token__",
      });
    });
  });

  describe("request.get callback", () => {
    afterEach(() => {
      global.request = {};
    });

    const profileCallback = jest.fn();

    it("should call the callback with an error", () => {
      const requestError = new Error("__test_error__");
      global.request = { get: jest.fn((opts, cb) => cb(requestError)) };
      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback.mock.calls).toHaveLength(1);
      expect(profileCallback.mock.calls[0][0]).toEqual(requestError);
    });

    it("should call the callback with the response body if request is not successful", () => {
      global.request = {
        get: jest.fn((opts, cb) => {
          cb(null, { statusCode: 401 }, "__test_body__");
        }),
      };
      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback.mock.calls).toHaveLength(1);
      expect(profileCallback.mock.calls[0][0]).toEqual(new Error("__test_body__"));
    });

    it("should handle invalid JSON responses", () => {
      global.request = {
        get: jest.fn((opts, cb) => {
          cb(null, { statusCode: 200 }, "__test_invalid_json__");
        }),
      };
      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback.mock.calls).toHaveLength(1);
      expect(profileCallback.mock.calls[0][0]).toEqual(new Error("__test_invalid_json__"));
    });

    it("should call the callback with the profile if response is ok", () => {
      const responseBody = {
        sub: "__test_sub__",
        field1: "test data",
      };

      global.request = {
        get: jest.fn((opts, cb) => {
          cb(null, { statusCode: 200 }, JSON.stringify(responseBody));
        }),
      };

      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback.mock.calls).toHaveLength(1);
      expect(profileCallback.mock.calls[0][0]).toBeNull();
      expect(profileCallback.mock.calls[0][1]).toEqual({
        user_id: "__test_sub__",
        ...responseBody,
      });
    });
  });
});
