import { encodeClientId, createClientSecret } from '../../src/utils/client-crypto';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Unsupported method',
    });
    return;
  }

  const { name = 'Unnamed App', redirect_uris, website } = req.body;

  // Ensure required parameters exist
  if (!redirect_uris || !name || !website || !Array.isArray(redirect_uris)) {
    res.status(400).json({
      error: 'Parameters are required: redirect_uris (array of urls), name (string), website (url)',
    });
    return;
  }

  if (redirect_uris.length > 1) {
    res.status(400).json({
      error: 'Only one redirect_uri is supported at the moment',
    });
    return;
  }

  try {
    const clientId = encodeClientId(req.body);
    const clientSecret = createClientSecret(clientId, redirect_uris);

    res.json({
      client_id: clientId,
      client_secret: clientSecret,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      error: `Unable to generate credentials: ${e.message}`,
    });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
      responseLimit: '1mb',
    },
  },
};
