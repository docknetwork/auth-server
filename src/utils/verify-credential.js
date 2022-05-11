import axios from 'axios';
import {
  DOCK_API_VERIFY_URL,
  DOCK_API_VERIFY_URL_TESTNET,
  API_KEY,
  API_KEY_TESTNET,
} from '../config';

export async function postVerify(credential, testnet = false) {
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

export function ensureAuthCredential(id, credential) {
  if (!credential.type || credential.type.indexOf('DockAuthCredential') === -1) {
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
}

export async function verifyCredential(id, credential) {
  ensureAuthCredential(id, credential);
  const isVerified = await postVerify(credential, !!process.env.USE_TESTNET);
  return isVerified;
}
