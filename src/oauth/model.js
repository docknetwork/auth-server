import { Client } from 'memjs';
import { DATA_TTL, TOKEN_TTL } from '../config';

function getKey(id) {
  return `dockauthprefix:${id}`;
}

export default class MemcachedOAuthModel {
  constructor() {
    this.client = Client.create();
  }

  async getAccessToken(bearerToken) {
    const vcCheckToken = await this.getVCCheck(bearerToken);

    if (vcCheckToken && vcCheckToken.user) {
      const currentUnixTime = Math.floor(Date.now() / 1000);
      return {
        accessTokenExpiresAt: new Date((currentUnixTime + TOKEN_TTL) * 1000),
        user: vcCheckToken.user,
      };
    }

    const accessToken = await this.get('token', bearerToken);
    if (accessToken) {
      accessToken.refreshTokenExpiresAt = new Date(accessToken.refreshTokenExpiresAt);
      accessToken.accessTokenExpiresAt = new Date(accessToken.accessTokenExpiresAt);
      return accessToken;
    }

    return false;
  }

  async getClient(clientId, clientSecret) {
    return {
      clientId,
      clientSecret: clientSecret || `secret:${clientId}`,
      redirectUris: ['https://dev-a3auqqdy.us.auth0.com/login/callback'], // TODO: need a way of setting this per client
      grants: ['authorization_code'],
    };
  }

  async saveToken(token, client, user) {
    // console.log('saveToken', token);
    const savedToken = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      userId: user.id,
      client,
      user,
    };

    await this.set('token', token.accessToken, savedToken);
    return savedToken;
  }

  async getUser(username, password) {
    // Return false as user/password login isnt used here
    return false;
  }

  async getAuthorizationCode(code) {
    // console.log('getAuthorizationCode', code);
    const res = await this.get('authCode', code);
    if (res) {
      res.expiresAt = new Date(res.expiresAt);
      return res;
    }
    return false;
  }

  async saveAuthorizationCode(code, client, user) {
    // console.log('saveAuthorizationCode', code, client, user);
    await this.set('authCode', code.authorizationCode, {
      ...code,
      client,
      user,
    });

    return code;
  }

  async revokeAuthorizationCode(code) {
    // console.log('revokeAuthorizationCode', code);
    await this.delete('authCode', code.authorizationCode);
    return code;
  }

  async delete(type, id) {
    // console.log('delete', type, id);
    await this.client.delete(getKey(type + ':' + id));
  }

  async set(type, id, value) {
    // console.log('set', type, id, value);
    await this.client.set(getKey(type + ':' + id), value ? JSON.stringify(value) : null, {
      expires: DATA_TTL,
    });
    return value;
  }

  async get(type, id) {
    // console.log('get', type, id);
    const result = await this.client.get(getKey(type + ':' + id));
    return result && result.value && JSON.parse(result.value);
  }

  async insertVCCheck(vcId, state) {
    // console.log('insertVCCheck', vcId, state);
    const check = {
      id: vcId,
      state,
    };
    await this.set('vccheck', vcId, check);
    return check;
  }

  async completeVCCheck(id, user) {
    // console.log('completeVCCheck', id, user);
    const res = await this.get('vccheck', id);
    if (res) {
      res.user = user;
      res.complete = true;
      await this.set('vccheck', id, res);
      return true;
    }

    return false;
  }

  async getVCCheck(id) {
    // console.log('getVCCheck', id);
    const res = await this.get('vccheck', id);
    return res;
  }

  async getRefreshToken(bearerToken) {
    // Return false here as this auth solution doesnt use refresh tokens
    return false;
  }
}
