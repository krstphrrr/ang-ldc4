import { domain, clientId, audience, serverUrl_p } from '../../auth_config.json';
export const environment = {
  production: true,
  SOCKET_URL: 'https://landscapedatacommons.org/',
  API_URL: 'https://api.landscapedatacommons.org/',
  TABLE_URL: 'https://api.landscapedatacommons.org/tables',
  auth: {
    domain,
    clientId,
    redirectUri: window.location.origin,
    audience,
  },
  dev:{
    serverUrl_p
  }

};
