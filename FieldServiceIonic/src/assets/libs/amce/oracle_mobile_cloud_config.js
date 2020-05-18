var mcs_config = {
  "logLevel": mcs.LOG_LEVEL.NONE,
  "logHTTP": true,
  "oAuthTokenEndPoint": "OAUTH_URL",
  "disableAnalyticsLocation": false,
  "mobileBackend": {
    "name": "NAME",
    "baseUrl": "BASE_URL",
    "authentication": {
      "type": mcs.AUTHENTICATION_TYPES.basic,
      "basic": {
        "mobileBackendId": "MOBILE_BACKEND_ID",
        "anonymousKey": "ANONYMOUS_KEY"
      },
      "oauth": {
        "clientId": "CLIENT_ID",
        "clientSecret": "CLIENT_SECRET"
      },
      "facebook":{
        "appId": "YOUR_FACEBOOK_APP_ID",
        "mobileBackendId": "YOUR_BACKEND_ID",
        "anonymousKey": "ANONYMOUS_KEY",
        "scopes": "public_profile,user_friends,email,user_location,user_birthday"
      },
      "token":{
        "mobileBackendId": "YOUR_BACKEND_ID",
        "anonymousKey": "ANONYMOUS_KEY",
        "clientId": "CLIENT_ID",
        "clientSecret": "CLIENT_SECRET"
      }
    }
  },
  // "sync": {
  //   "periodicRefreshPolicy": "PERIODIC_REFRESH_POLICY_REFRESH_NONE",
  //   "policies": [
  //     {
  //       "path": '/mobile/custom/firstApi/tasks',
  //       "fetchPolicy": 'FETCH_FROM_SERVICE_ON_CACHE_MISS'
  //     },
  //     {
  //       "path": '/mobile/custom/secondApi/tasks',
  //     }
  //   ]
  // },
  "syncExpress": {
    "handler": "OracleRestHandler",
    "policies": [
      {
        "path": '/mobile/custom/firstApi/tasks/:id(\\d+)?',
      },
      {
        "path": '/mobile/custom/secondApi/tasks/:id(\\d+)?',
      }
    ]
  }
};
