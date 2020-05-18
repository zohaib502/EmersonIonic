import {IMCS,
    IOracleMobileCloudConfig,
    IMobileBackendConfig,
    IAuthenticationConfig,
    IBasicAuthConfig } from 'mcs';
import * as mcssdk from 'mcs';
  const mcs: IMCS = mcssdk;
  
  export const mcsConfig: IOracleMobileCloudConfig = {
    logLevel: mcs.LOG_LEVEL.NONE,
    logHTTP: true,
    oAuthTokenEndPoint: 'OAUTH_URL',
    disableAnalyticsLocation: false,
    mobileBackend: <IMobileBackendConfig>{
      name: 'NAME',
      baseUrl: 'BASE_URL',
      authentication: <IAuthenticationConfig>{
        type: mcs.AUTHENTICATION_TYPES.basic,
        basic: <IBasicAuthConfig>{
          mobileBackendId: 'MOBILE_BACKEND_ID',
          anonymousKey: 'ANONYMOUS_KEY'
        }
      }
    }
  };