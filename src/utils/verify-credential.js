import axios from 'axios';
import { DOCK_API_VERIFY_URL, API_KEY } from '../config';

export async function postVerify(credential) {
  try {
    const d = await axios.post(DOCK_API_VERIFY_URL, credential, {
      headers: {
        'DOCK-API-TOKEN': API_KEY,
      },
    });
    return d.data.verified;
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
  const isVerified = await postVerify(credential);
  return isVerified;
}
