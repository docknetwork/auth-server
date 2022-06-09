import { encodeClientId, createClientSecret } from '../../src/utils/client-crypto';
import isValidHttpUrl from '../../src/utils/valid-url';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Unsupported method',
    });
    return;
  }

  const { name, redirect_uris, website } = req.body;

  // Ensure required parameters exist
  if (!redirect_uris || !name || !website || !Array.isArray(redirect_uris)) {
    res
      .status(400)
      .send('Parameters are required: redirect_uris (array of urls), name (string), website (url)');
    return;
  }

  if (redirect_uris.length > 1) {
    res.status(400).send('Only one redirect_uri is supported at the moment');
    return;
  }

  if (!isValidHttpUrl(website)) {
    res.status(400).send('Website must be a valid HTTP/HTTPS URL');
    return;
  }

  if (!isValidHttpUrl(redirect_uris[0])) {
    res.status(400).send('redirect_uri must be a valid HTTP/HTTPS URL');
    return;
  }

  const clientId = encodeClientId(req.body);
  const clientSecret = createClientSecret(clientId, redirect_uris);
  res.json({
    client_id: clientId,
    client_secret: clientSecret,
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
      responseLimit: '1mb',
    },
  },
};
