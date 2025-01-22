export const DATA_TTL = 60 * 60 * 12; // 12 hours
export const TOKEN_TTL = 60 * 60; // 1 hour
export const WALLET_APP_URI = 'dockwallet://didauth?url=';
export const APP_STORE_URI = 'https://apps.apple.com/br/app/truvera-wallet/id6739359697';
export const GPLAY_STORE_URI = 'https://play.google.com/store/apps/details?id=com.truvera.app';

export const API_KEY = process.env.API_KEY;
export const API_KEY_TESTNET = process.env.API_KEY_TESTNET;

export const DOCK_API_VERIFY_URL = process.env.DOCK_API_VERIFY_URL || 'https://api.truvera.io/verify';
export const DOCK_API_VERIFY_URL_TESTNET =
  process.env.DOCK_API_VERIFY_URL_TESTNET || 'https://api-testnet.truvera.io/verify';

export const SERVER_URL =
  process.env.SERVER_URL || process.env.VERCEL_URL || 'http://localhost:3000';
