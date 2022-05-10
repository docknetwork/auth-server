export const DATA_TTL = 60 * 60 * 12; // 12 hours
export const TOKEN_TTL = 60 * 60; // 1 hour
export const WALLET_APP_URI = 'dockwallet://didauth?url=';
export const APP_STORE_URI = 'https://apps.apple.com/us/app/dock-crypto-wallet/id1565227368';
export const GPLAY_STORE_URI = 'https://play.google.com/store/apps/details?id=com.dockapp';
export const SERVER_URL =
  process.env.SERVER_URL || process.env.VERCEL_URL || 'http://localhost:3000';
