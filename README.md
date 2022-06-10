## Dock DID Auth

This service provides an oauth solution for authenticating with DIDs through Verifiable Credentials.

## Getting Started

First, setup [#env-vars](the environment variables) and pre-requisite services and then you can run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building and Deployment

Building the application for production can be done with:

```bash
npm run build
# or
yarn build
```

or you may wish to run it as a custom server with:

```bash
npm run start
# or
yarn start
```

## Env Vars

Running the auth server requires:

- A free [https://certs.dock.io/](Dock Certs API key) in order to verify credentials. Set through API_KEY
- A memcached instance, you can find many free ones online for a small project or use a local docker container. Set through MEMCACHIER_SERVERS
- A secure, randomly generated cryptographic key for authorizing clients set through CRYPTO_KEY
- A public domain set through SERVER_URL (defaults to localhost:3000)

Example `.env.local` file:
```
API_KEY=certs-api-key
MEMCACHIER_SERVERS=your-memcached-uri:11211
CRYPTO_KEY=32charactersecurecryptokey
SERVER_URL=https://mydomain.com/
```

## Auth0

This service can be used as an Auth0 Social Connector allowing users to sign into applications using their DIDs.

### Setting Up a Custom Social Connector on Auth0

See this page on the Auth0 website for details about submitting and configuring your custom [Social Connection](https://auth0.com/docs/customize/integrations/marketplace-partners/social-connections-for-partners).

### Configuring Applications to Use This Connector

See [Auth0 Application Setup](docs/auth0_configure_application.md)

## Vercel Deploy

Deploy to vercel in one click with this button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdocknetwork%2Fauth-server&env=MEMCACHIER_SERVERS,API_KEY,CRYPTO_KEY&envDescription=Environment%20variables%20needed%20for%20this%20applicaton&envLink=https%3A%2F%2Fgithub.com%2Fdocknetwork%2Fauth-server%23env-vars&project-name=did-auth&repo-name=did-auth&redirect-url=https%3A%2F%2Fdock.io%2F%3Fgtm_source%3Dauthdeploy)
