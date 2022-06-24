# Sign in with Dock Web3 ID - Auth0 Integration

The Dock Web3 ID integration allows users to privately sign in to your app using [Decentralized Identifiers (DIDs)](https://docs.api.dock.io/#dids) & [Verifiable Credentials (VCs)](https://www.dock.io/) via scanning QR codes with their Dock Wallet apps. This step-by-step guide will show you how to integrate Dock Web3 ID into your authentication flow easily.

![auth-flow](../public/Dock%20Web3%20ID%20Auth0%20Integration.jpg)

## Auth0 Registration

If you don't already have Auth0 set up for your applications follow these steps. Otherwise, skip to [Login with Dock Registration](#login-with-dock-registration).
1. [Sign up](https://www.auth0.com/signup) for an Auth0 account.
2. Setup your **Application** under the Applications option on the navigation menu.

## Login with Dock Registration

1. Register for a Client ID and Client Secret by posting a REST request like the following to the Dock auth server https://auth.dock.io/register.

  ```bash
  curl -X POST -H "Content-Type: application/json" https://auth.dock.io/register -d '{"name": "My App", "website": "https://www.my-app.org", "redirect_uris":["https://YOUR_AUTH0_DOMAIN/login/callback"]}'
  ```
  NOTE: You can get your Auth0 domain from the **Settings** tab on the **Application** page

  You will get back a response similar to the following:

  ```json
  {
    "client_id":"jT4iswsxJsoHLbMXjKECcdGeXMaGowc6IIB/YRYspJqkuYEAynhUNQUOVMosGxwjJ5/DKNMafsmupXiA26GfceUIorCIlQDo+f7iq/H7MFtkfDBkKnW1iUEOcC/9nP2E",
    "client_secret":"8z+zGijpdnR33bON+8IOQKXdX2Eg6rn0mwksis0dz22fv5UMToGbjazcGNRM1Ary"
  }
  ```


## Create the Connection

1. Use the **Add Integration** button above to start.
2. Read the necessary access requirements and click `Continue`.
3. Configure the integration with the `Client ID` and `Client Secret` you received in the [Login with Dock Registration](#login-with-dock-registration) steps.
4. Select the **Permissions** needed for your applications
5. Turn off **Sync user profile attributes at each login**
6. Click `Create`
7. On the **Applications** tab choose the application you setup in the [Auth0 Registration](#auth0-registration) steps to enable "Sign in with DockID" for that application.

## Testing
The connection can be tested here: https://auth0.com/docs/authenticate/identity-providers/test-connections

## Get the Dock Wallet

[![Google Play](../public/gplay.svg)](https://play.google.com/store/apps/details?id=com.dockapp) [![App Store](../public/app-store.svg)](https://apps.apple.com/us/app/dock-crypto-wallet/id1565227368)

