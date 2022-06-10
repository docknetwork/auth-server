This microservice is responsible for allowing push/pull of messages to/from DIDs using VCs for authentication

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Auth0

This service can be used as an Auth0 Social Connector allowing users to sign into applications using their DIDs.

### Setting Up a Custom Social Connector on Auth0

See this page on the Auth0 website for details about submitting and configuring your custom [Social Connection](https://auth0.com/docs/customize/integrations/marketplace-partners/social-connections-for-partners).

### Configuring Applications to Use This Connector

See [Auth0 Application Setup](docs/auth0_configure_application.md)