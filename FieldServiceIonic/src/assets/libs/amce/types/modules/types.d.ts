/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
declare enum Headers {
    ORACLE_MOBILE_DIAGNOSTIC_SESSION_ID = "Oracle-Mobile-DIAGNOSTIC-SESSION-ID",
    ORACLE_MOBILE_DEVICE_ID = "Oracle-Mobile-DEVICE-ID",
    ORACLE_MOBILE_CLIENT_REQUEST_TIME = "Oracle-Mobile-CLIENT-REQUEST-TIME",
    ORACLE_MOBILE_ANALYTICS_APPLICATION_ID = "Oracle-Mobile-Analytics-Application-Id",
    ORACLE_MOBILE_NAME = "Oracle-Mobile-Name",
    ORACLE_MOBILE_CREATED_BY = "Oracle-Mobile-Created-By",
    ORACLE_MOBILE_CREATED_ON = "Oracle-Mobile-Created-On",
    ORACLE_MOBILE_MODIFIED_BY = "Oracle-Mobile-Modified-By",
    ORACLE_MOBILE_MODIFIED_ON = "Oracle-Mobile-Modified-On",
    ORACLE_MOBILE_SYNC_RESOURCE_TYPE = "Oracle-Mobile-Sync-Resource-Type",
    ORACLE_MOBILE_SYNC_AGENT = "Oracle-Mobile-Sync-Agent",
    LOCATION = "Location",
    ORACLE_MOBILE_BACKEND_ID = "Oracle-Mobile-Backend-Id",
    ORACLE_MOBILE_SOCIAL_IDENTITY_PROVIDER = "Oracle-Mobile-Social-Identity-Provider",
    ORACLE_MOBILE_SOCIAL_ACCESS_TOKEN = "Oracle-Mobile-Social-Access-Token",
    ORACLE_MOBILE_CLIENT_SDK_INFO = "Oracle-Mobile-Client-SDK-Info",
    ACCEPT = "Accept",
    CONTENT_TYPE = "Content-Type",
    E_TAG = "ETag",
    IF_MATCH = "If-Match",
    AUTHORIZATION = "Authorization",
    X_USER_IDENTITY_DOMAIN_NAME = "X-USER-IDENTITY-DOMAIN-NAME",
    X_RESOURCE_IDENTITY_DOMAIN_NAME = "X-RESOURCE-IDENTITY-DOMAIN-NAME",
    ACCEPT_ENCODING = "Accept-Encoding",
    IF_MODIFIED_SINCE = "if-modified-since",
    IF_NONE_MATCH = "if-none-match",
}
declare enum ContentTypes {
    APPLICATION_JSON = "application/json",
    TEXT_PLAIN = "text/plain",
    X_WWW_FORM_FORM_URLENCODED = "application/x-www-form-urlencoded; charset=utf-8",
}
declare enum HttpMethods {
    GET = "GET",
    PUT = "PUT",
    PATCH = "PATCH",
    POST = "POST",
    DELETE = "DELETE",
    HEAD = "HEAD",
}
declare enum ResourceTypes {
    ITEM = "item",
    COLLECTION = "collection",
    FILE = "file",
}
declare enum AuthenticationTypes {
    basic = "basic",
    oauth = "oauth",
    facebook = "facebook",
    token = "token",
}
declare enum ModuleNames {
    STORAGE = "Storage",
    AUTHORIZATION = "Authorization",
    USER_MANAGEMENT = "UserManagement",
    APP_POLICES = "AppPolicies",
    LOCATION = "Location",
    SYNC = "Sync",
    SYNC_EXPRESS = "SyncExpress",
    NOTIFICATIONS = "Notifications",
    MCS_ANALYTICS = "MCSAnalytics",
    ANALYTICS = "Analytics",
    CUSTOM_CODE = "CustomCode",
    APP_CONFIG = "AppConfig",
}
declare enum PlatformNames {
    JAVASCRIPT = "Javascript",
    CORDOVA = "Cordova",
    REACT_NATIVE = "ReactNative",
}
declare enum DevicePlatforms {
    ANDROID = "android",
    IOS = "ios",
}
declare enum NotificationProviders {
    FCM = "FCM",
    APNS = "APNS",
    WNS = "WNS",
    SYNIVERSE = "SYNIVERSE",
}
declare enum XMLHttpRequestResponseTypes {
    JSON = "json",
    BLOB = "blob",
    ARRAY_BUFFER = "arraybuffer",
    DOCUMENT = "document",
    TEXT = "text",
}
declare enum SyncRequestHandlerTypes {
    GENERIC = "Generic",
    MCS = "MCS",
    ORACLE_REST = "OracleRest",
}
declare type NetworkResponseHeaders = {
    [lowerCaseKey: string]: string;
};
export { Headers, ContentTypes, HttpMethods, ResourceTypes, AuthenticationTypes, ModuleNames, PlatformNames, DevicePlatforms, NotificationProviders, XMLHttpRequestResponseTypes, NetworkResponseHeaders, SyncRequestHandlerTypes };
