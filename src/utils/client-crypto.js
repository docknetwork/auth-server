import crypto from 'crypto';

export const ENCODING_DELIMITER = '\n';
export const CLIENT_ID_PREFIX = 'da:';
export const CLIENT_SECRET_PREFIX = 'das:';

const CRYPTO_ALGORITHM = 'aes-256-cbc';
const CRYPTO_CIPHER_OUTPUT = 'base64';
const CRYPTO_NONCE_LENGTH = 4;
const CRYPTO_KEY = process.env.CRYPTO_KEY || '6352e481f4338d176352e481f4338d17';

if (!process.env.CRYPTO_KEY) {
  console.warn('WARNING: Using a compromised hard-coded static test/development key, set the CRYPTO_KEY env variable');
}

export function cleanInput(input) {
  return input.replaceAll(ENCODING_DELIMITER, '').trim();
}

export function encodeClientId({ name, website, redirect_uris }) {
  const nonce = crypto.randomBytes(CRYPTO_NONCE_LENGTH).toString('hex');
  const toEncodeClientID = `${CLIENT_ID_PREFIX}${nonce}${cleanInput(
    website
  )}${ENCODING_DELIMITER}${cleanInput(name)}${ENCODING_DELIMITER}${cleanInput(redirect_uris[0])}`;
  const encryptedId = encrypt(toEncodeClientID, CRYPTO_KEY);
  return encryptedId;
}

export function getHash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

export function createClientSecret(clientId) {
  const clientIDHash = getHash(clientId, CRYPTO_KEY.length);
  const nonce = crypto.randomBytes(CRYPTO_NONCE_LENGTH).toString('hex');
  const toEncodeClientSecret = `${CLIENT_SECRET_PREFIX}${nonce}${clientIDHash}`;
  return encrypt(toEncodeClientSecret, clientIDHash);
}

export function isValidClientSecret(clientId, clientSecret) {
  const clientIDHash = getHash(clientId, CRYPTO_KEY.length);
  const decryptedSecret = decrypt(clientSecret, clientIDHash);

  if (decryptedSecret.length < 16) {
    return false;
  }

  if (decryptedSecret.substr(0, CLIENT_SECRET_PREFIX.length) !== CLIENT_SECRET_PREFIX) {
    return false;
  }

  const secretHash = decryptedSecret.substr(CLIENT_SECRET_PREFIX.length + CRYPTO_NONCE_LENGTH * 2);
  return secretHash === clientIDHash;
}

export function decodeClientID(clientId) {
  if (!clientId) {
    return null;
  }

  const unpackedStr = decrypt(clientId, CRYPTO_KEY);
  if (unpackedStr.length < 8) {
    return null;
  }

  if (unpackedStr.substr(0, CLIENT_ID_PREFIX.length) !== CLIENT_ID_PREFIX) {
    return null;
  }

  const splitStr = unpackedStr
    .substr(ENCODING_DELIMITER.length + CRYPTO_NONCE_LENGTH * 2 + 2)
    .split(ENCODING_DELIMITER);
  const website = splitStr[0];
  const name = splitStr[1];
  const redirectUri = splitStr[2];

  if (!website || !name || !redirectUri) {
    return null;
  }

  return {
    website: website.trim(),
    name: name.trim(),
    redirectUri: redirectUri.trim(),
  };
}

export function encrypt(text, iv) {
  const cipher = crypto.createCipheriv(
    CRYPTO_ALGORITHM,
    CRYPTO_KEY,
    iv.padEnd(16, 'f').substr(0, 16)
  );
  let encrypted = cipher.update(text, 'utf-8', CRYPTO_CIPHER_OUTPUT);
  encrypted += cipher.final(CRYPTO_CIPHER_OUTPUT);
  return encrypted;
}

export function decrypt(encryptedText, iv) {
  try {
    const decipher = crypto.createDecipheriv(
      CRYPTO_ALGORITHM,
      CRYPTO_KEY,
      iv.padEnd(16, 'f').substr(0, 16)
    );
    let decrypted = decipher.update(encryptedText, 'base64');
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    console.error(e);
    return '';
  }
}
