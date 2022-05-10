import { SERVER_URL } from '../../../src/config';

export const authQueryProps = {
  response_type: 'code',
  redirect_uri: 'https://dev-a3auqqdy.us.auth0.com/login/callback',
  state: 'LAO-aLl19QgZ4ZcdSj3EQMYDziuYUnAj',
  client_id: 'dockstagingtest',
  prompt: 'login',
  scope: 'public',
};

export const authStateID = `${authQueryProps.client_id}${authQueryProps.state}`;

export const expectedSubmitUri = SERVER_URL + `/verify?id=${authStateID}`;
