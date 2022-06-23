# Dock Web3 ID as an oauth2 provider

The primary feature of Dock Web3 ID is to be an authentication provider which can accept DIDs and Verfiable Credentials. To achieve this, we support oauth2. Typically, you would use an oauth2 library and that would have setup instructions for different providers. Please note that the domain here is for Dock's hosted instance. If you wish to use your own, replace the domain appropriately.

## Client registration

Register for a Client ID and Client Secret by posting a POST REST request like the following to the auth server https://auth.dock.io/register.

```bash
curl -X POST -H "Content-Type: application/json" https://auth.dock.io/register -d '{"name": "My App", "website": "https://www.my-app.org", "redirect_uris":["https://YOUR_DOMAIN/your_callback_uri"]}'
```

You will get back a response similar to the following:

```json
{
  "client_id":"jT4iswsxJsoHLbMXjKECcdGeXMaGowc6IIB/YRYspJqkuYEAynhUNQUOVMosGxwjJ5/DKNMafsmupXiA26GfceUIorCIlQDo+f7iq/H7MFtkfDBkKnW1iUEOcC/9nP2E",
  "client_secret":"8z+zGijpdnR33bON+8IOQKXdX2Eg6rn0mwksis0dz22fv5UMToGbjazcGNRM1Ary"
}
```

## Grant type & scopes

The service currently only supports the `authorization_code` grant type and response type `code`.

Ultimately the scope support depends on the wallet application being used to gather and send data, but the typical scopes that are supported are:
- public/profile
- email

## Endpoints

The following endpoints are exposed by the auth service for oauth2:

|  URL | Purpose  |
| ------------ | ------------ |
|  https://auth.dock.io/oauth2/authorize | Authorize  |
|  https://auth.dock.io/oauth2/token | Access token  |
|  https://auth.dock.io/oauth2/userinfo | Get profile/user info  |


## NextAuth.js provider

It is pretty simple to integrate with NextAuth.js (or similar JS auth provider) with the below snippet:

```javascript
function DockAuthProvider(options, domain = 'auth.dock.io') {
  return {
    id: 'dockauth',
    name: 'Web3 ID',
    type: 'oauth',
    version: '2.0',
    scope: 'public email',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: `https://${domain}/oauth2/token`,
    authorizationUrl: `https://${domain}/oauth2/authorize?response_type=code`,
    profileUrl: `https://${domain}/oauth2/userinfo`,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.image,
      };
    },
    ...options,
  };
}

DockAuthProvider({
  clientId: process.env.DOCK_CLIENT_ID,
  clientSecret: process.env.DOCK_SECRET,
});
```