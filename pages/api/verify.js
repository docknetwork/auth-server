import { model } from '../../src/oauth/server';
import { verifyCredential } from '../../src/utils/verify-credential';

export default async (req, res) => {
  // Ensure required parameters exist
  const { vc } = req.body;
  const { id } = req.query;
  if (req.method !== 'POST' || !vc || !id) {
    res.status(400).json({
      error: 'Missing or invalid post body',
    });
    return;
  }

  const vcCheck = await model.getVCCheck(id);
  if (!vcCheck || vcCheck.user) {
    res.status(400).json({
      error: `Invalid ID: ${id}`,
    });
    return;
  }

  try {
    const userId = typeof vc.issuer === 'object' ? vc.issuer.id : vc.issuer;
    const [isVerified, verifyError] = await verifyCredential(id, vc);
    if (isVerified) {
      // now that we are verified, we need to update the model so that
      // when user calls check it will return acess token
      await model.completeVCCheck(id, {
        ...vc.credentialSubject,
        id: userId,
        user_id: userId,
        state: undefined,
      });
    }

    res.json({
      verified: isVerified,
      error: verifyError,
      userId,
    });
  } catch (e) {
    res.status(400).json({
      verified: false,
      error: e.message,
    });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
      responseLimit: '500kb',
    },
  },
};
