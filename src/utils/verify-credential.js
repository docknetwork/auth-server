import { apiRequest } from './api';

const DOCK_API_VERIFY_URL = process.env.DOCK_API_VERIFY_URL || 'https://api.dock.io/verify';
const DOCK_API_VERIFY_URL_TESTNET =
  process.env.DOCK_API_VERIFY_URL_TESTNET || 'https://api-testnet.dock.io/verify';

const API_KEY = process.env.API_KEY;
const API_KEY_TESTNET = process.env.API_KEY_TESTNET;

export async function verifyCredential(credential, testnet = false) {
  try {
    const result = await apiRequest(
      testnet ? DOCK_API_VERIFY_URL_TESTNET : DOCK_API_VERIFY_URL,
      'POST',
      credential,
      testnet ? API_KEY_TESTNET : API_KEY
    );
    return result.verified;
  } catch (e) {
    return false;
  }
}
