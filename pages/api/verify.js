import { model } from '../../src/oauth/server';
import { postIssue } from '../../src/utils/verify-credential';
import { AUTO_DISTRIBUTE_VC } from '../../src/config';

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

    let issueResponse = {
      data: ''
    };
    if (AUTO_DISTRIBUTE_VC) {
      const issueVc = {
        persist: true,
        password: 'iiw36',
        algorithm: 'dockbbs+',
        distribute: true,
        template: '9045e6bf-196b-44fe-9975-5b21a06223f3',
        credential: {
          name: 'IIW Proof of Attendance',
          issuer: 'did:dock:5Da5Y1eDqK2wtdEwjCCmBWeCDzH3TuRSMDM7anGdmpb32S5y',
          type: [
            'VerifiableCredential',
            'BasicCredential'
          ],
          subject: {
            id: vc.issuer.id ?? vc.issuer,
            name: vc.credentialSubject.name,
            event: 'IIW 36',
            eventDate: '04/19/2023',
            eventLocation: 'Computer History Museum'
          }
        }
      };

      issueResponse = await postIssue(issueVc);
    }
    res.status(200).json({
      verified: true,
      userId: 0,
      message: issueResponse.data
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
