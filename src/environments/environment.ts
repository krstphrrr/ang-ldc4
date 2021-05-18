// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { domain, clientId, audience, serverUrl } from '../../auth_config.json';
import {settings} from '../app/services/a_settings'

let domain = settings.domain
let clientId = settings.clientId
let audience = settings.audience
let serverUrl = settings.serverUrl

export const environment = {
  production: false,
  SOCKET_URL: 'http://localhost:5000',
  API_URL: 'http://localhost:5002',
  TABLE_URL: 'http://localhost:5002/tables',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
