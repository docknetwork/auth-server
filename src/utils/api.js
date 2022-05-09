import axios from 'axios';

export class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function apiRequest(url, method = 'GET', data = undefined, apiKey = undefined) {
  const apiToken = apiKey || process.env.API_KEY;
  if (!apiToken) {
    throw new Error(`No API token for request`);
  }

  const headers = {
    'DOCK-API-TOKEN': apiToken,
  };

  return axios
    .request({
      url,
      method,
      data,
      headers,
    })
    .then((d) => {
      if (d.data) {
        const json = typeof d.data === 'string' ? JSON.parse(d.data) : d.data;
        if (json.error || json.status >= 400) {
          return Promise.reject(new APIError(json.error, json.status || d.status));
        }
        return json;
      }
    })
    .catch((e) => {
      if (e.response && e.response.data) {
        const { error, status } = e.response.data;
        return Promise.reject(new APIError(error || e.response.data, status || e.response.status));
      } else {
        return Promise.reject(e);
      }
    });
}
