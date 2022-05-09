import cors from '../../src/utils/cors';
import { model } from '../../src/oauth/server';
import { verifyCredential as verifyVC } from '../../src/utils/verify-credential';

export async function verifyCredential(id, credential) {
  if (credential.type.indexOf('DockAuthCredential') === -1) {
    throw new Error('Wrong credential type');
  }

  const subject = credential.credentialSubject;
  if (Array.isArray(subject)) {
    throw new Error('Subject cannot be array');
  }

  if (typeof subject !== 'object') {
    throw new Error('Subject must be object');
  }

  if (!subject.state) {
    throw new Error('Subject requires state');
  }

  if (!process.env.DISABLE_STATE_CHECK && subject.state !== id) {
    throw new Error('State mismatch');
  }

  let isVerified = await verifyVC(credential, false);
  if (!isVerified) {
    isVerified = await verifyVC(credential, true);
  }
  return isVerified;
}

export default async (req, res) => {
  // Apply cors to the request, OPTIONS will early out here
  if (!cors(req, res)) {
    return;
  }

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
      error: 'Invalid ID',
    });
    return;
  }

  try {
    const isVerified = await verifyCredential(id, vc);
    if (isVerified) {
      // now that we are verified, we need to update the model so that
      // when user calls check it will return acess token
      await model.completeVCCheck(id, {
        ...vc.credentialSubject,
        id: vc.issuer,
        state: undefined,
      });
    }

    res.json({
      verified: isVerified,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
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
