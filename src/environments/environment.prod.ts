import {settings} from '../app/services/a_settings'

let domain = settings.domain
let clientId = settings.clientId
let audience = settings.audience
let serverUrl = settings.serverUrl_p

// let serverUrl = serverUrl_p

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
    serverUrl
  }

};
