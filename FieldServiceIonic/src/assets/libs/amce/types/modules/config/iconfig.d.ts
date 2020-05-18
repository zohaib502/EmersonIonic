/**
* Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
*/
/**
 * Oracle Mobile Cloud configuration
 * @memberof configuration
 */
export interface IOracleMobileCloudConfig {
    /**
     * Log level for mcs logger
     * @type {number} - 0 NONE, 1 ERROR, 2 WARN, 3 INFO, 4 DEBUG
     */
    logLevel?: number;
    /**
     * Include http headers and requests in log
     * @type {boolean}
     */
    logHTTP?: boolean;
    /**
     * OAuth token endpoint for OAth authentication
     * @type {string}
     */
    oAuthTokenEndPoint: string;
    /**
     * Mobile backend configuration
     * @type {IMobileBackendConfig}
     */
    mobileBackend?: IMobileBackendConfig;
    /**
     * Configuration for mcs synchronization
     * Can't be combined with syncExpress configuration
     * @optional
     * @type {ISyncConfig}
     */
    sync?: ISyncConfig;
    /**
     * Configuration for sync express
     * Can't be combined with sync configuration
     * @optional
     * @type {ISyncExpressConfig}
     */
    syncExpress?: ISyncExpressConfig;
    /**
     * Disable logging location by legacy analytics
     * @deprecated
     */
    disableAnalyticsLocation?: boolean;
}
/**
 * Analytics configuration
 * @memberof configuration
 */
export interface IAnalyticsAppConfig {
    /**
     * Base url for analytics
     * @type {string}
     */
    baseUrl: string;
    /**
     * Switch on/off analytics for this backend
     * @type {boolean}
     */
    enableAnalytics: boolean;
    /**
     * Application key
     * @type {string}
     */
    appKey: string;
    /**
     * Analytics authentication configuration
     * @type {IAnalyticsAuthentication}
     */
    authentication: IAnalyticsAuthentication;
    /**
     * Analytics notification configuration
     * @type {IAnalyticsNotification}
     */
    notification: IAnalyticsNotification;
}
/**
 * Analytics notification configuration
 * @memberof configuration
 */
export interface IAnalyticsNotification {
    /**
     * Analytics notification profile name for android
     * @type {string}
     */
    profileNameAndroid?: string;
    /**
     * Analytics notification profile name for ios
     * @type {string}
     */
    profileNameIOS?: string;
}
/**
 * Analytics authentication configuration
 * @memberof configuration
 */
export interface IAnalyticsAuthentication {
    /**
     * Analytics OAuth configuration
     * @type {IOAuthConfig}
     */
    oauth: IOAuthConfig;
}
/**
 * Synchronization configuration
 * @memberof configuration
 */
export interface ISyncConfig {
    /**
     * Synchronization periodic refresh policy
     * 'PERIODIC_REFRESH_POLICY_REFRESH_NONE'
     * 'PERIODIC_REFRESH_POLICY_REFRESH_EXPIRED_ITEM_ON_STARTUP'
     * 'PERIODIC_REFRESH_POLICY_PERIODICALLY_REFRESH_EXPIRED_ITEMS'
     * @type {string}
     */
    periodicRefreshPolicy: string;
    /**
     * Polices per endpoint
     * @type {IPolicesConfig[]}
     */
    policies: IPolicesConfig[];
}
/**
 * Synchronization express configuration
 * @memberof configuration
 */
export interface ISyncExpressConfig {
    /**
     * Handler type to process requests
     * OracleRestHandler - for oracle rest endpoints
     * GenericRequestHandler - for simple rest endpoints, default value
     * @optional
     * @type {string}
     */
    handler?: string;
    /**
     * Polices per endpoint
     * @type {IPolicesConfig[]}
     */
    policies: IPolicesConfig[];
}
/**
 * Endpoint Police configuration
 * @memberof configuration
 */
export interface IPolicesConfig {
    /**
     * Path for the endpoint
     * @type {string}
     */
    path: string;
    /**
     * Fetch policy for current path
     * 'FETCH_FROM_CACHE_SCHEDULE_REFRESH'
     * 'FETCH_FROM_SERVICE_IF_ONLINE'
     * 'FETCH_FROM_SERVICE'
     * @type {string}
     */
    fetchPolicy: string;
}
/**
 * Mobile backend configuration
 * @memberof configuration
 */
export interface IMobileBackendConfig {
    /**
     * Base url for the backend and analytics
     * @type {string}
     */
    baseUrl: string;
    /**
     * Mobile backend name
     * @type {string}
     */
    name: string;
    /**
     * Backend authorization's configuration
     * @type {IAuthenticationConfig}
     */
    authentication: IAuthenticationConfig;
}
/**
 * Authentication configuration
 * @memberof configuration
 */
export interface IAuthenticationConfig {
    /**
     * Authentication default type: basic, oath, facebook, tokenExchange
     */
    type?: string;
    /**
     * Basic authentication configuration
     * @type {IBasicAuthConfig}
     */
    basic?: IBasicAuthConfig;
    /**
     * OAuth authentication configuration
     * @type {IOAuthConfig}
     */
    oauth?: IOAuthConfig;
    /**
     * Facebook authentication configuration
     * @type {IFacebookAuthConfig}
     */
    facebook?: IFacebookAuthConfig;
    /**
     * Third party token authentication configuration
     * @type {ITokenExchangeAuthConfig}
     */
    token?: ITokenExchangeAuthConfig;
}
/**
 * Basic Authentication configuration
 * @memberof configuration
 */
export interface IBasicAuthConfig {
    /**
     * Mobile backend identifier
     * @type {string}
     */
    mobileBackendId: string;
    /**
     * Anonymous key for anonymous authentication
     * @type {string}
     */
    anonymousKey: string;
}
/**
 * OAuth Authentication configuration
 * @memberof configuration
 */
export interface IOAuthConfig {
    /**
     * OAuth client identifier
     * @type {string}
     */
    clientId: string;
    /**
     * OAuth client secret key
     * @type {string}
     */
    clientSecret: string;
}
/**
 * Facebook Authentication configuration
 * @memberof configuration
 */
export interface IFacebookAuthConfig {
    /**
     * Facebook application identifier
     * @type {string}
     */
    appId: string;
    /**
     * Anonymous key for anonymous authentication
     * @type {string}
     */
    anonymousKey: string;
    /**
     * Mobile backend identifier
     * @type {string}
     */
    mobileBackendId: string;
    /**
     * Facebook authentication access types: public_profile,user_friends,email,user_location,user_birthday
     * @type {string}
     */
    scopes: string;
}
/**
 * Token Authentication configuration
 * @memberof configuration
 */
export interface ITokenExchangeAuthConfig {
    /**
     * Mobile backend identifier
     * @type {string}
     */
    mobileBackendId: string;
    /**
     * Anonymous key for anonymous authentication
     * @type {string}
     */
    anonymousKey: string;
    /**
     * OAuth client identifier
     * @type {string}
     */
    clientId: string;
    /**
     * OAuth client secret key
     * @type {string}
     */
    clientSecret: string;
}
