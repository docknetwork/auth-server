import axios from 'axios';
import { DOCK_API_VERIFY_URL, DOCK_API_VERIFY_URL_TESTNET, API_KEY, API_KEY_TESTNET } from '../config';

export async function verifyCredential(credential, testnet = false) {
  try {
    const d = await axios.post(
      testnet ? DOCK_API_VERIFY_URL_TESTNET : DOCK_API_VERIFY_URL,
      credential,
      {
        headers: {
          'DOCK-API-TOKEN': testnet ? API_KEY_TESTNET : API_KEY,
        },
      }
    );
    const json = typeof d.data === 'string' ? JSON.parse(d.data) : d.data;
    return json.verified;
  } catch (e) {
    console.error(e);
    return false;
  }
}
