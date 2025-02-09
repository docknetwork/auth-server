/* globals request */
module.exports = function fetchUserProfile(accessToken, context, callback) {
  request.get(
    {
      url: "https://auth.dock.io/oauth2/userinfo",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    (err, resp, body) => {
      if (err) {
        return callback(err);
      }

      if (resp.statusCode !== 200) {
        return callback(new Error(`Unable to fetch user profile: non-success status ${resp.statusCode}`));
      }

      let bodyParsed;
      try {
        bodyParsed = JSON.parse(body);
      } catch (jsonError) {
        return callback(new Error('Unable to parse JSON body'));
      }

      const profile = {
        user_id: `${bodyParsed.id || bodyParsed.sub}`,
        ...bodyParsed,
      };

      return callback(null, profile);
    }
  );
};
