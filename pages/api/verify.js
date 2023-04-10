import { model } from '../../src/oauth/server';
import { verifyCredential } from '../../src/utils/verify-credential';

export default async (req, res) => {
  // Ensure required parameters exist
  const { vc } = req.body;
  const { id } = req.query;

//  console.log(`vc: ${JSON.stringify(vc)}`);
  if (req.method !== 'POST' || !vc || !id) {
    res.status(400).json({
      error: 'Missing or invalid post body',
    });
    return;
  }

  // Get the check, error if it doesnt exist
  const vcCheck = await model.getVCCheck(id);
  if (!vcCheck) {
    res.status(400).json({
      error: `Invalid authorization ID, please go back and try again. (ID: ${id})`,
    });
    return;
  }

  // Check was completed previously, return valid
  if (vcCheck.complete) {
    res.json({
      verified: true,
      userId: vcCheck.user.id,
    });
    return;
  }

  try {
    console.log(`IIW Attendee: ${vc?.credentialSubject?.name?.padEnd(40, ' -')}  ${JSON.stringify(vc.issuer)}`);
    res.status(200).json({
      verified: true,
      userId: 0
    });

    // const userId = typeof vc.issuer === 'object' ? vc.issuer.id : vc.issuer;
    // const [isVerified, verifyError] = await verifyCredential(id, vc);
    // if (isVerified) {
    //   // now that we are verified, we need to update the model so that
    //   // when user calls check it will return acess token
    //   await model.completeVCCheck(id, {
    //     ...vc.credentialSubject,
    //     id: userId,
    //     user_id: userId,
    //     state: undefined,
    //   });
    // }

    // res.json({
    //   verified: isVerified,
    //   error: verifyError,
    //   userId,
    // });
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
