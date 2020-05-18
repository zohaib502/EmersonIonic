/**
 * Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 * Oracle Mobile Cloud Enterprise JavaScript SDK for Cordova, Release: 18.3.3.0, E91527-01
 */

(function(_module, _exports, _define, _window, _global, _self, _this) {
  var cxa;
  var MCSGlobal;

  /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 70);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Headers;
(function (Headers) {
    Headers["ORACLE_MOBILE_DIAGNOSTIC_SESSION_ID"] = "Oracle-Mobile-DIAGNOSTIC-SESSION-ID";
    Headers["ORACLE_MOBILE_DEVICE_ID"] = "Oracle-Mobile-DEVICE-ID";
    Headers["ORACLE_MOBILE_CLIENT_REQUEST_TIME"] = "Oracle-Mobile-CLIENT-REQUEST-TIME";
    Headers["ORACLE_MOBILE_ANALYTICS_APPLICATION_ID"] = "Oracle-Mobile-Analytics-Application-Id";
    Headers["ORACLE_MOBILE_NAME"] = "Oracle-Mobile-Name";
    Headers["ORACLE_MOBILE_CREATED_BY"] = "Oracle-Mobile-Created-By";
    Headers["ORACLE_MOBILE_CREATED_ON"] = "Oracle-Mobile-Created-On";
    Headers["ORACLE_MOBILE_MODIFIED_BY"] = "Oracle-Mobile-Modified-By";
    Headers["ORACLE_MOBILE_MODIFIED_ON"] = "Oracle-Mobile-Modified-On";
    Headers["ORACLE_MOBILE_SYNC_RESOURCE_TYPE"] = "Oracle-Mobile-Sync-Resource-Type";
    Headers["ORACLE_MOBILE_SYNC_AGENT"] = "Oracle-Mobile-Sync-Agent";
    Headers["LOCATION"] = "Location";
    Headers["ORACLE_MOBILE_BACKEND_ID"] = "Oracle-Mobile-Backend-Id";
    Headers["ORACLE_MOBILE_SOCIAL_IDENTITY_PROVIDER"] = "Oracle-Mobile-Social-Identity-Provider";
    Headers["ORACLE_MOBILE_SOCIAL_ACCESS_TOKEN"] = "Oracle-Mobile-Social-Access-Token";
    Headers["ORACLE_MOBILE_CLIENT_SDK_INFO"] = "Oracle-Mobile-Client-SDK-Info";
    Headers["ACCEPT"] = "Accept";
    Headers["CONTENT_TYPE"] = "Content-Type";
    Headers["ACCS_TOKEN"] = "accsToken";
    Headers["E_TAG"] = "ETag";
    Headers["IF_MATCH"] = "If-Match";
    Headers["AUTHORIZATION"] = "Authorization";
    Headers["X_USER_IDENTITY_DOMAIN_NAME"] = "X-USER-IDENTITY-DOMAIN-NAME";
    Headers["X_RESOURCE_IDENTITY_DOMAIN_NAME"] = "X-RESOURCE-IDENTITY-DOMAIN-NAME";
    Headers["ACCEPT_ENCODING"] = "Accept-Encoding";
    Headers["IF_MODIFIED_SINCE"] = "if-modified-since";
    Headers["IF_NONE_MATCH"] = "if-none-match";
})(Headers || (Headers = {}));
exports.Headers = Headers;
var ContentTypes;
(function (ContentTypes) {
    ContentTypes["APPLICATION_JSON"] = "application/json";
    ContentTypes["TEXT_PLAIN"] = "text/plain";
    ContentTypes["X_WWW_FORM_FORM_URLENCODED"] = "application/x-www-form-urlencoded; charset=utf-8";
})(ContentTypes || (ContentTypes = {}));
exports.ContentTypes = ContentTypes;
var HttpMethods;
(function (HttpMethods) {
    HttpMethods["GET"] = "GET";
    HttpMethods["PUT"] = "PUT";
    HttpMethods["PATCH"] = "PATCH";
    HttpMethods["POST"] = "POST";
    HttpMethods["DELETE"] = "DELETE";
    HttpMethods["HEAD"] = "HEAD";
})(HttpMethods || (HttpMethods = {}));
exports.HttpMethods = HttpMethods;
var ResourceTypes;
(function (ResourceTypes) {
    ResourceTypes["ITEM"] = "item";
    ResourceTypes["COLLECTION"] = "collection";
    ResourceTypes["FILE"] = "file";
})(ResourceTypes || (ResourceTypes = {}));
exports.ResourceTypes = ResourceTypes;
var AuthenticationTypes;
(function (AuthenticationTypes) {
    AuthenticationTypes["basic"] = "basic";
    AuthenticationTypes["oauth"] = "oauth";
    AuthenticationTypes["facebook"] = "facebook";
    AuthenticationTypes["token"] = "token";
})(AuthenticationTypes || (AuthenticationTypes = {}));
exports.AuthenticationTypes = AuthenticationTypes;
var ModuleNames;
(function (ModuleNames) {
    ModuleNames["STORAGE"] = "Storage";
    ModuleNames["AUTHORIZATION"] = "Authorization";
    ModuleNames["USER_MANAGEMENT"] = "UserManagement";
    ModuleNames["APP_POLICES"] = "AppPolicies";
    ModuleNames["LOCATION"] = "Location";
    ModuleNames["SYNC"] = "Sync";
    ModuleNames["SYNC_EXPRESS"] = "SyncExpress";
    ModuleNames["NOTIFICATIONS"] = "Notifications";
    ModuleNames["MCS_ANALYTICS"] = "MCSAnalytics";
    ModuleNames["ANALYTICS"] = "Analytics";
    ModuleNames["CUSTOM_CODE"] = "CustomCode";
    ModuleNames["APP_CONFIG"] = "AppConfig";
})(ModuleNames || (ModuleNames = {}));
exports.ModuleNames = ModuleNames;
var PlatformNames;
(function (PlatformNames) {
    PlatformNames["JAVASCRIPT"] = "Javascript";
    PlatformNames["CORDOVA"] = "Cordova";
    PlatformNames["REACT_NATIVE"] = "ReactNative";
})(PlatformNames || (PlatformNames = {}));
exports.PlatformNames = PlatformNames;
var DevicePlatforms;
(function (DevicePlatforms) {
    DevicePlatforms["ANDROID"] = "android";
    DevicePlatforms["IOS"] = "ios";
})(DevicePlatforms || (DevicePlatforms = {}));
exports.DevicePlatforms = DevicePlatforms;
var NotificationProviders;
(function (NotificationProviders) {
    NotificationProviders["FCM"] = "FCM";
    NotificationProviders["APNS"] = "APNS";
    NotificationProviders["WNS"] = "WNS";
    NotificationProviders["SYNIVERSE"] = "SYNIVERSE";
})(NotificationProviders || (NotificationProviders = {}));
exports.NotificationProviders = NotificationProviders;
var XMLHttpRequestResponseTypes;
(function (XMLHttpRequestResponseTypes) {
    XMLHttpRequestResponseTypes["JSON"] = "json";
    XMLHttpRequestResponseTypes["BLOB"] = "blob";
    XMLHttpRequestResponseTypes["ARRAY_BUFFER"] = "arraybuffer";
    XMLHttpRequestResponseTypes["DOCUMENT"] = "document";
    XMLHttpRequestResponseTypes["TEXT"] = "text";
})(XMLHttpRequestResponseTypes || (XMLHttpRequestResponseTypes = {}));
exports.XMLHttpRequestResponseTypes = XMLHttpRequestResponseTypes;
var SyncRequestHandlerTypes;
(function (SyncRequestHandlerTypes) {
    SyncRequestHandlerTypes["GENERIC"] = "Generic";
    SyncRequestHandlerTypes["MCS"] = "MCS";
    SyncRequestHandlerTypes["ORACLE_REST"] = "OracleRest";
})(SyncRequestHandlerTypes || (SyncRequestHandlerTypes = {}));
exports.SyncRequestHandlerTypes = SyncRequestHandlerTypes;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger(module) {
        this.module = module;
    }
    Logger.prototype.debug = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.log(Logger.LOG_LEVEL.DEBUG, params);
    };
    Logger.prototype.error = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.log(Logger.LOG_LEVEL.ERROR, params);
    };
    Logger.prototype.info = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.log(Logger.LOG_LEVEL.INFO, params);
    };
    Logger.prototype.warn = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.log(Logger.LOG_LEVEL.WARN, params);
    };
    Logger.prototype.log = function (level, params) {
        if (Logger.logLevel >= level) {
            params.unshift('[mcs.' + this.module + ']');
            var method = void 0;
            switch (Logger.logLevel) {
                case Logger.LOG_LEVEL.ERROR:
                    method = console.error;
                    break;
                case Logger.LOG_LEVEL.WARN:
                    method = console.warn;
                    break;
                case Logger.LOG_LEVEL.INFO:
                    method = console.info;
                    break;
                case Logger.LOG_LEVEL.DEBUG:
                    method = console.debug;
                    break;
            }
            if (Logger.historyEnabled) {
                Logger.history.push(Object.assign({}, params, { level: level }));
                if (Logger.historySize <= Logger.history.length) {
                    Logger.history.shift();
                }
            }
            method.apply(console, params);
        }
    };
    Logger.LOG_LEVEL = {
        NONE: 0,
        ERROR: 1,
        WARN: 2,
        INFO: 3,
        DEBUG: 4,
    };
    Logger.logLevel = Logger.LOG_LEVEL.ERROR;
    Logger.historyEnabled = false;
    Logger.historySize = 100;
    Logger.history = [];
    return Logger;
}());
exports.Logger = Logger;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 * Created by Yuri Panshin on 2016-08-26.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @classdesc Class that provides network response details.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var NetworkResponse = /** @class */ (function () {
    function NetworkResponse(statusCode, data, headers) {
        /**
         * The network status code.
         * @type {Number}
         * @readonly
         * @name NetworkResponse#statusCode
         * @mcs
         */
        this.statusCode = 0;
        /**
         * The error data.
         * @type {Object}
         * @readonly
         * @name NetworkResponse#data
         * @mcs
         */
        this.data = null;
        /**
         * The response headers in dictionary format with lowercase keys.
         * @type {NetworkResponseHeaders}
         * @readonly
         * @name NetworkResponse#headers
         * @mcs
         */
        this.headers = null;
        this.statusCode = statusCode;
        this.data = data;
        this.headers = headers;
    }
    return NetworkResponse;
}());
exports.NetworkResponse = NetworkResponse;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Dictionary = /** @class */ (function () {
    function Dictionary(init) {
        this._keys = [];
        this._values = [];
        for (var x = 0; x < init.length; x++) {
            this[init[x].key.toString()] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }
    Dictionary.prototype.add = function (key, value) {
        this[key.toString()] = value;
        this._keys.push(key);
        this._values.push(value);
    };
    Dictionary.prototype.remove = function (key) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[key.toString()];
    };
    Dictionary.prototype.keys = function () {
        return this._keys;
    };
    Dictionary.prototype.values = function () {
        return this._values;
    };
    Dictionary.prototype.containsKey = function (key) {
        return typeof this[key.toString()] !== "undefined";
    };
    Dictionary.prototype.toLookup = function () {
        return this;
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var network_response_1 = __webpack_require__(2);
var types_1 = __webpack_require__(0);
/**
 * Authentication response
 * @private
 */
var AuthenticationResponse = /** @class */ (function (_super) {
    __extends(AuthenticationResponse, _super);
    function AuthenticationResponse(response, accessToken) {
        var _this = _super.call(this, response.statusCode, response.data, response.headers) || this;
        _this.accessToken = accessToken;
        return _this;
    }
    return AuthenticationResponse;
}(network_response_1.NetworkResponse));
exports.AuthenticationResponse = AuthenticationResponse;
/**
 * @class
 * @global
 * @classdesc Class used to authorize a mobile user against Oracle Mobile Cloud Enterprise.
 * Callers should use MobileBackend's [authorization]{@link Backend#authorization} property.
 * @abstract
 * @hideconstructor
 * @mcs
 */
var Authorization = /** @class */ (function () {
    function Authorization(utils, platform) {
        this.utils = utils;
        this.platform = platform;
        this._onAuthenticationCallbacks = [];
        this.logger = new logger_1.Logger('Authorization');
    }
    Object.defineProperty(Authorization.prototype, "isAuthorized", {
        /**
         * Is SDK authorized.
         * Returns true if a user has been authorized, false otherwise.
         * A user can be authorized by calling authenticate() or authenticateAnonymous().
         * @type {Boolean}
         * @name Authorization#isAuthorized
         * @mcs
         */
        get: function () {
            return this._isAuthorized;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get access token.
     * Returns the current access token from user credentials.
     * @returns {String} current access token from user credentials.
     * @function
     * @name Authorization#getAccessToken
     * @mcs
     */
    Authorization.prototype.getAccessToken = function () {
        return this._accessToken;
    };
    Authorization.prototype._setAccessToken = function (token) {
        this._accessToken = token;
    };
    /**
     * Get is anonymous
     * @return {boolean}
     * @private
     */
    Authorization.prototype._getIsAnonymous = function () {
        return this._isAnonymous;
    };
    /**
     * Get is authorized
     * @return {boolean}
     * @private
     */
    Authorization.prototype._getIsAuthorized = function () {
        return this._isAuthorized;
    };
    /**
     * Get anonymous access token
     * @return {string}
     * @private
     */
    Authorization.prototype._getAnonymousAccessToken = function () {
        return this._anonymousAccessToken;
    };
    /**
     * Authenticate anonymous
     * @param {IDictionary<Headers, string>} headers
     * @param {string} url
     * @param {HttpMethods} method
     * @param {boolean} withCredentials
     * @param data
     * @return {Promise<AuthenticationResponse>}
     * @private
     */
    Authorization.prototype._authenticateAnonymousInvoke = function (headers, url, method, withCredentials, data) {
        this.logout();
        headers = this._getHeaders(headers);
        headers = this._getAnonymousAuthorizationHeaders(headers);
        return this.platform.invokeService({
            url: url,
            method: method,
            headers: headers,
            withCredentials: withCredentials,
            data: data,
            module: types_1.ModuleNames.AUTHORIZATION,
        })
            .then(function (response) { return new AuthenticationResponse(response, null); })
            .then(this._anonymousTokenResponseConverter.bind(this))
            .catch(invokeServiceError.bind(this))
            .then(this._authenticateAnonymousSuccess.bind(this));
        function invokeServiceError(response) {
            this.logger.error('Login failed with error: ' + response.statusCode);
            this._clearState();
            return Promise.reject(response);
        }
    };
    /**
     * Get headers
     * @param headers
     * @return {any}
     * @private
     */
    Authorization.prototype._getHeaders = function (headers) {
        return headers;
    };
    /**
     * Authenticate anonymous success callback.
     * @param {AuthenticationResponse} response
     * @return {INetworkResponse}
     * @private
     */
    Authorization.prototype._authenticateAnonymousSuccess = function (response) {
        this.logger.info('User logged in anonymously ' + response.statusCode);
        this._setAuthenticateAnonymousSuccess(response.accessToken);
        return response;
    };
    /**
     * Set authentication anonymous success callback.
     * @param {string} token
     * @private
     */
    Authorization.prototype._setAuthenticateAnonymousSuccess = function (token) {
        this._isAnonymous = true;
        this._isAuthorized = true;
        this._anonymousAccessToken = token;
        for (var i = 0; i < this._onAuthenticationCallbacks.length; i++) {
            this._onAuthenticationCallbacks[i](token);
        }
    };
    /**
     * Authenticate error callback
     * @param {INetworkResponse} response
     * @private
     */
    Authorization.prototype._authenticateError = function (response) {
        this.logger.error('Login failed with error: ' + response.statusCode);
        this._clearState();
    };
    /**
     * Clear state after logout
     * @private
     */
    Authorization.prototype._clearState = function () {
        this._accessToken = null;
        this._isAnonymous = false;
        this._anonymousAccessToken = null;
        this._isAuthorized = false;
    };
    /**
     * The authentication callback.
     * This callback called when authentication happen.
     * @callback Authorization~OnAuthenticationCallback
     * @param token {String} The authentication token received from server.
     * @mcs
     */
    /**
     * On authentication event.
     * Subscribe for on authentication event
     * @param {Authorization~OnAuthenticationCallback} callback The callback that will be called when authentication happen.
     * @function
     * @name Authorization#onAuthentication
     * @mcs
     */
    Authorization.prototype.onAuthentication = function (callback) {
        this._onAuthenticationCallbacks.push(callback);
    };
    return Authorization;
}());
exports.Authorization = Authorization;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var sync_resource_type_1 = __webpack_require__(10);
var mcs_request_handler_1 = __webpack_require__(15);
var types_1 = __webpack_require__(0);
var SyncProcessor = /** @class */ (function () {
    function SyncProcessor(backend, apiName, endpointPath, resolvingOfflineUpdate, utils, platform, options, common) {
        this.backend = backend;
        this.apiName = apiName;
        this.endpointPath = endpointPath;
        this.resolvingOfflineUpdate = resolvingOfflineUpdate;
        this.utils = utils;
        this.platform = platform;
        this.options = options;
        this.common = common;
    }
    SyncProcessor.prototype.getHttpHeaders = function (requestHeaders) {
        var headers = this.backend.getHttpHeaders(requestHeaders);
        headers.add(types_1.Headers.ORACLE_MOBILE_SYNC_AGENT, 'true');
        return headers;
    };
    SyncProcessor.prototype.getType = function (responseHeaders, responseData) {
        var type = sync_resource_type_1.SyncResourceType.file;
        var resourceType = responseHeaders[types_1.Headers.ORACLE_MOBILE_SYNC_RESOURCE_TYPE.toLowerCase()];
        if (resourceType != null) {
            if (resourceType === types_1.ResourceTypes.ITEM) {
                type = sync_resource_type_1.SyncResourceType.item;
            }
            else if (resourceType === types_1.ResourceTypes.COLLECTION) {
                type = sync_resource_type_1.SyncResourceType.collection;
            }
        }
        else {
            if (this.common.isString(responseData)) {
                try {
                    var json = JSON.parse(responseData);
                    if (this.common.isArray(json)) {
                        type = sync_resource_type_1.SyncResourceType.collection;
                    }
                    else {
                        type = sync_resource_type_1.SyncResourceType.item;
                    }
                }
                catch (e) {
                    type = sync_resource_type_1.SyncResourceType.file;
                }
            }
        }
        return type;
    };
    SyncProcessor.prototype.getUri = function (response, url) {
        var location = response && response.headers ?
            response.headers[types_1.Headers.LOCATION.toLowerCase()] : null;
        if (location != null) {
            return '/' + location;
        }
        var obj = null;
        if (response.data) {
            if (typeof response.data === 'string') {
                obj = response.data !== '' ? JSON.parse(response.data) : null;
            }
            else {
                obj = response.data;
            }
        }
        if (obj && obj[mcs_request_handler_1.McsRequestHandler.URI_KEY]) {
            var uri = obj[mcs_request_handler_1.McsRequestHandler.URI_KEY];
            delete obj[mcs_request_handler_1.McsRequestHandler.URI_KEY];
            return uri;
        }
        return this.options.parseURL(url).path;
    };
    SyncProcessor.prototype.createResource = function (method, url, statusCode, requestHeaders, responseHeaders, requestData, responseData, response) {
        var location = response.headers[types_1.Headers.LOCATION.toLowerCase()];
        if (location != null) {
            location = '/' + location;
        }
        else {
            location = url;
        }
        var type = sync_resource_type_1.SyncResourceType.file;
        var resourceType = responseHeaders[types_1.Headers.ORACLE_MOBILE_SYNC_RESOURCE_TYPE.toLowerCase()];
        if (resourceType != null) {
            if (resourceType === types_1.ResourceTypes.ITEM) {
                type = sync_resource_type_1.SyncResourceType.item;
            }
            else if (resourceType === types_1.ResourceTypes.COLLECTION) {
                type = sync_resource_type_1.SyncResourceType.collection;
            }
        }
        else {
            if (this.common.isString(responseData)) {
                try {
                    var json = JSON.parse(responseData);
                    if (this.common.isArray(json)) {
                        type = sync_resource_type_1.SyncResourceType.collection;
                    }
                    else {
                        type = sync_resource_type_1.SyncResourceType.item;
                    }
                }
                catch (e) {
                    type = sync_resource_type_1.SyncResourceType.file;
                }
            }
        }
        return null;
    };
    return SyncProcessor;
}());
exports.SyncProcessor = SyncProcessor;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*/
var db_1 = __webpack_require__(9);
var logger_1 = __webpack_require__(1);
var RequestHandler = /** @class */ (function () {
    function RequestHandler(dbName, $options, $common, $utils, dbAdapter) {
        var _this = this;
        this.dbName = dbName;
        this.$options = $options;
        this.$common = $common;
        this.$utils = $utils;
        this.logger = new logger_1.Logger('RequestHandler');
        this.prefix = $options.dbPrefix;
        this.$db = this._createDatabase(dbAdapter);
        $options.onDbPrefixChange = function (oldVal, newVal) {
            _this.prefix = newVal;
            _this.$db = _this._createDatabase(dbAdapter);
        };
    }
    RequestHandler.prototype.isPersistentRequest = function (request) {
        if (!request) {
            throw new Error('request cannot be undefined or null value');
        }
        if (!this.$common.isObject(request)) {
            throw new Error('request has to be defined object with properties like: url, data etc.');
        }
        if (this.$common.isEmpty(request)) {
            throw new Error('request cannot be empty object, it request properties like: url, data etc.');
        }
        if (this.$common.isArray(request) || this.$common.isFunction(request)) {
            throw new Error('request cannot be array or function');
        }
        if (!('url' in request)) {
            throw new Error('request.url was not specified');
        }
        return true;
    };
    RequestHandler.prototype.isPersistentGetRequest = function (request) {
        this.isPersistentRequest(request);
        return true;
    };
    RequestHandler.prototype.isPostRequest = function (request) {
        this.isPersistentRequest(request);
        if (!('data' in request)) {
            throw new Error('request.data was not defined!');
        }
        if (!this.$common.isObject(request.data)) {
            throw new Error('request.data is not a object or array!');
        }
        if (this.$common.isFunction(request.data)) {
            throw new Error('request.data cannot be function');
        }
        return true;
    };
    RequestHandler.prototype.isOfflinePersistObj = function (obj) {
        return !!('meta' in obj && obj.meta.hasOwnProperty('offline-persist'));
    };
    RequestHandler.prototype.isLokiDbObj = function (obj) {
        return !!('$loki' in obj && typeof (obj.$loki) === 'number' && !isNaN(obj.$loki));
    };
    RequestHandler.prototype.buildFindQueryBasedOnUrlParams = function (urlQueryParams) {
        var dbQuery = {};
        if (urlQueryParams.attr.length > 0) {
            var key = urlQueryParams.attr[0].name;
            dbQuery[key] = (urlQueryParams.attr[0].pattern.indexOf('\d') >= 0)
                ? parseInt(urlQueryParams.attr[0].value, 10)
                : urlQueryParams.attr[0].value + '';
        }
        return dbQuery;
    };
    RequestHandler.prototype.buildUniqueIDValue = function (isPersistentUrl, value) {
        var isInt = function () {
            if ((isPersistentUrl.uri.tokens.length > 1)) {
                return isPersistentUrl.uri.tokens[isPersistentUrl.uri.tokens.length - 1].pattern.indexOf('\d') >= 0;
            }
            else {
                return false;
            }
        };
        var parse = function (value) {
            return isInt() ? parseInt(value, 10) : value + '';
        };
        if (this.$common.isEmpty(value)) {
            return parse(this.$common.getUID());
        }
        if (typeof value === 'number' && isInt()) {
            return value;
        }
        return parse(value);
    };
    /**
     * Transform the payload and add it into the $db!
     *
     * NOTE: Such a transformations could hold a lot of resources!
     *
     * @param collection
     * @param isPersistentUrl
     * @param payload
     * @returns {*}
     */
    RequestHandler.prototype.handleGetRootArrayPayload = function (payload, isPersistentUrl, collection) {
        var _this = this;
        if (isPersistentUrl.uri.tokens.length > 1) {
            var dbArray = collection.find();
            if (dbArray.length > 0) {
                var keyNameToCompare_1 = isPersistentUrl.uri.tokens[1].name;
                collection.removeWhere(function (dbObj) {
                    var foundObjectIndex = payload.findIndex(function (payloadObj) {
                        return (payloadObj[keyNameToCompare_1] === dbObj[keyNameToCompare_1]);
                    });
                    if (foundObjectIndex > -1) {
                        try {
                            if (_this.isOfflinePersistObj(dbObj)) {
                                dbObj = _this.$common.deepExtend(payload[foundObjectIndex], dbObj);
                            }
                            else {
                                _this.$common.extendOwn(dbObj, payload[foundObjectIndex]);
                            }
                            collection.update(dbObj);
                            payload.splice(foundObjectIndex, 1);
                        }
                        catch (e) {
                            _this.logger.error(e);
                        }
                        finally {
                            return false;
                        }
                    }
                    else {
                        if (_this.isOfflinePersistObj(dbObj)) {
                            return false;
                        }
                        return true;
                    }
                });
                payload.forEach(function (obj) {
                    if (_this.isLokiDbObj(obj)) {
                        collection.update(obj);
                    }
                    else {
                        collection.insert(obj);
                    }
                });
                return collection.find();
            }
            return collection.insert(payload);
        }
        collection.removeWhere(function (obj) {
            return (!_this.isOfflinePersistObj(obj));
        });
        return collection.insert(payload);
    };
    RequestHandler.prototype.handleGetRootObjectPayload = function (payload, isPersistentUrl, collection) {
        var _this = this;
        if (isPersistentUrl.uri.tokens.length > 1) {
            var keyNameToCompare = isPersistentUrl.uri.tokens[1].name;
            if (!payload.hasOwnProperty(keyNameToCompare)) {
                this.logger.error('payload does not contain unique key specified in the URL settings');
                throw new Error('payload does not contain unique key specified in the URL settings');
            }
            var findObjByKeyQuery = {};
            findObjByKeyQuery[keyNameToCompare] = payload[keyNameToCompare];
            var result = collection.findOne(findObjByKeyQuery);
            if (result) {
                if (this.isOfflinePersistObj(result)) {
                    result = this.$common.deepExtend(payload, result);
                }
                else {
                    this.$common.extendOwn(result, payload);
                }
                return collection.update(result);
            }
            return collection.insert(payload);
        }
        collection.removeWhere(function (obj) { return (!_this.isOfflinePersistObj(obj)); });
        return collection.insert(payload);
    };
    /**
     * Build nested property structure to be used in GET calls to setup or edit existing objects!
     *
     * @param queryParams  query parameters properties!
     * @returns {string}  prop1.prop2[value].prop3....
     * @deprecated  use buildNestedPropertyArrayParams
     */
    RequestHandler.prototype.buildNestedPropertySearchString = function (queryParams) {
        var nestedProperty = '';
        if (queryParams.attr.length > 1) {
            for (var i = 1; i < queryParams.attr.length; i++) {
                if (queryParams.attr[i].is) {
                    if (nestedProperty.length > 0)
                        nestedProperty += '.' + queryParams.attr[i].name;
                    else
                        nestedProperty += queryParams.attr[i].name;
                }
                else {
                    if (nestedProperty.length > 0) {
                        nestedProperty += '.' + queryParams.attr[i].name + '[' + queryParams.attr[i].value + ']';
                    }
                    else {
                        nestedProperty += queryParams.attr[i].value;
                    }
                }
            }
        }
        return nestedProperty;
    };
    /**
     * Has to be build a string of properties which can be used when adding new elements!
     *
     * @param queryParams
     * @param isPersistentUrl
     * @param isNotGet
     *
     * @return {Array<persistenceUtils~Property>} - array of properties with parameters and values
     */
    RequestHandler.prototype.buildNestedPropertyArrayParams = function (isPersistentUrl, queryParams, isNotGet) {
        if (isNotGet === void 0) { isNotGet = false; }
        var nestedProperty = [];
        var params = queryParams.attr;
        if (Array.isArray(params) && params.length > 0) {
            var tokens = isPersistentUrl.uri.tokens.length > 1 ? isPersistentUrl.uri.tokens.slice(1) : [];
            for (var i = 0; i < params.length; i++) {
                var isLast = (params.length - 1) === i;
                if (params[i].is) {
                    nestedProperty.push({
                        name: params[i].name,
                        value: null,
                        isProperty: true,
                        isInteger: false,
                    });
                    if (isLast && tokens[i + 1] && isNotGet) {
                        var isInt = this.$utils.isUrlRegexInteger(tokens[i + 1].pattern);
                        nestedProperty.push({
                            name: tokens[i + 1].name,
                            value: isInt ? this.$common.getUID() : this.$common.getUID() + '',
                            isProperty: false,
                            isInteger: isInt,
                        });
                    }
                }
                else {
                    var proValue = params[i].value || this.$common.getUID();
                    nestedProperty.push({
                        name: params[i].name,
                        value: proValue,
                        isProperty: false,
                        isInteger: this.$utils.isUrlRegexInteger(tokens[i].pattern),
                    });
                }
            }
        }
        return nestedProperty;
    };
    /**
     * Search for that nested object and add the new payload to it, if any!
     *
     * @param obj
     * @param persistentUrlObj
     * @param queryParams
     * @param payload
     * @param dbPayload {Object} - payload that exists in local database
     * @returns {{obj: *, result: *}}
     */
    RequestHandler.prototype.createObjFromUrlParamsForExistingForPost = function (obj, persistentUrlObj, queryParams, payload, dbPayload) {
        var nestedProperty = this.buildNestedPropertyArrayParams(persistentUrlObj, queryParams);
        var result = obj;
        if (Array.isArray(nestedProperty) && nestedProperty.length > 0) {
            var nestedQuery = void 0;
            if (dbPayload) {
                var key = this.getKeyForCurrentObject(persistentUrlObj, queryParams);
                nestedQuery = {
                    key: key,
                    value: dbPayload[key.name],
                };
            }
            result = this.$utils.setNestedProperty2(obj, nestedProperty, payload, nestedQuery);
        }
        else {
            this.$common.extendOwn(obj, payload);
        }
        return {
            obj: obj,
            result: result,
        };
    };
    /**
     * Returns current nested item key token
     * @param persistentUrlObj
     * @param queryParams
     * @returns {*}
     */
    RequestHandler.prototype.getKeyForCurrentObject = function (persistentUrlObj, queryParams) {
        var length = queryParams.attr.length;
        return persistentUrlObj.uri.tokens[length + 1];
    };
    /**
     * In case of given DB object but we have URL with sub parameters, we have to check if those nested obj exist,
     * and create them if not and add the payload inside.
     *
     * @param obj - object form the offline DB
     * @param queryParams - URL parameters, usually what is returned from $utils.extractKeyValuesFromUrl2
     * @param payload - from the REST API call
     * @return {{obj: *, result: *}}
     * @param persistentUrlObj
     */
    RequestHandler.prototype.createObjFromUrlParamsForGETAction = function (obj, persistentUrlObj, queryParams, payload) {
        var nestedProperty = this.buildNestedPropertyArrayParams(persistentUrlObj, queryParams, false);
        var result = obj;
        if (Array.isArray(nestedProperty) && nestedProperty.length > 0) {
            result = this.$utils.setNestedProperty2(obj, nestedProperty, payload);
        }
        return {
            obj: obj,
            result: result,
        };
    };
    /**
     * Try to find that nested object when offline or when no payload in GET
     * @param obj
     * @param persistentUrlObj
     * @param queryParams
     * @returns {*}
     */
    RequestHandler.prototype.getNestedPropertyFromUrlParamsForExisting = function (obj, persistentUrlObj, queryParams) {
        var nestedProperty = this.buildNestedPropertyArrayParams(persistentUrlObj, queryParams, false);
        if (Array.isArray(nestedProperty) && nestedProperty.length > 0) {
            return this.$utils.getNestedProperty(obj, nestedProperty);
        }
        return obj;
    };
    /**
     * If forces, you could mark the object to be stored in the DB only and not synced!
     *
     * @param obj
     * @param force
     * @returns {*}
     */
    RequestHandler.prototype.markObjAsOfflineIfForced = function (obj, force) {
        if (force) {
            if (this.isOfflinePersistObj(obj)) {
                delete obj.meta['offline-persist'];
            }
            return obj;
        }
        if ('meta' in obj) {
            obj.meta['offline-persist'] = true;
            return obj;
        }
        obj['meta'] = {};
        obj.meta['offline-persist'] = true;
        return obj;
    };
    /**
     * Use only if you have no new data, empty payload, and you want to return everything from the db,
     * depending on the GET URL
     *
     * TODO: should be extended to be able to query sub element!
     * @param response{url}
     * @returns {*}
     */
    RequestHandler.prototype.handleGet = function (response) {
        var parsed = this.$options.parseURL(response.url);
        var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
        if (!isPersistentUrl) {
            throw new Error('Persistence.RequestHandler.get() given URI was not configured for persistence:' + parsed.path);
        }
        var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
        var collection = this.$db.getCollectionByName(queryParams.root);
        var keyValueObj = this.buildFindQueryBasedOnUrlParams(queryParams);
        if (!this.$common.isEmpty(keyValueObj)) {
            var result = collection.findOne(keyValueObj);
            if (result) {
                var nestedObject = this.getNestedPropertyFromUrlParamsForExisting(result, isPersistentUrl, queryParams);
                var cleanObject = this.$common.cleanObject(nestedObject);
                return this.buildResponseObject(cleanObject);
            }
            else {
                return null; // TODO: check if generic handler fine with this response (from generic handler: return [];)
            }
        }
        else {
            this.logger.debug('return all from db');
            var cleanObjects = this.$common.cleanObjects(collection.find());
            return this.buildResponseObject(cleanObjects);
        }
    };
    /**
     * Response property
     * @typedef persistenceRequestHandler~Response
     * @property url {String}
     * @property data {Object}
     */
    /**
     * Stores/merges given payload into the offline db!
     *
     * @param response {persistenceRequestHandler~Response}
     * @returns {*}
     */
    RequestHandler.prototype.handleGetStore = function (response) {
        var parsed = this.$options.parseURL(response.url);
        var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
        if (!isPersistentUrl) {
            throw new Error('Persistence.RequestHandler.get() given URI was not configured for persistence:' + parsed.path);
        }
        var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
        var collection = this.$db.getCollectionByName(queryParams.root);
        var payload = this.getResponsePayload(response);
        var keyValueObj = this.buildFindQueryBasedOnUrlParams(queryParams);
        if (!this.$common.isEmpty(keyValueObj)) {
            var result = collection.findOne(keyValueObj);
            var newObj = void 0;
            if (result) {
                newObj = this.createObjFromUrlParamsForGETAction(result, isPersistentUrl, queryParams, payload);
                collection.update(newObj.obj);
            }
            else {
                newObj = this.createObjFromUrlParamsForGETAction(keyValueObj, isPersistentUrl, queryParams, payload);
                collection.insert(newObj.obj);
            }
            return this.buildResponseObject(newObj.result);
        }
        else {
            if (this.$common.isArray(payload) && !this.$common.isFunction(payload) && !this.$common.isEmpty(payload)) {
                var items = this.handleGetRootArrayPayload(payload, isPersistentUrl, collection);
                return this.buildResponseObject(items);
            }
            else if (this.$common.isObject(payload)
                && !this.$common.isArray(payload)
                && !this.$common.isFunction(payload)
                && !this.$common.isEmpty(payload)) {
                return this.handleGetRootObjectPayload(payload, isPersistentUrl, collection);
            }
            else {
                this.logger.error('handleGetStore', 'unknown or empty object passed for the operation');
                throw new Error('RequestHandler.handleGetStore -> unknown or empty object passed for the operation');
            }
        }
    };
    /**
     * Handle post array payload.
     *
     * @param payload
     * @param isPersistentUrl
     * @param collection
     * @param force
     * @returns {*}
     */
    RequestHandler.prototype.handlePostRootArrayPayload = function (payload, isPersistentUrl, collection, force) {
        var _this = this;
        var keyNameToCompare = (isPersistentUrl.uri.tokens.length > 1) ? isPersistentUrl.uri.tokens[1].name : null;
        payload.forEach(function (obj) {
            if (_this.isLokiDbObj(obj)) {
                _this.markObjAsOfflineIfForced(obj, force);
                collection.update(obj);
            }
            else if (keyNameToCompare && obj.hasOwnProperty(keyNameToCompare)) {
                var result = collection.findOne({ keyNameToCompare: obj[keyNameToCompare] });
                if (result) {
                    _this.$common.extendOwn(result, obj);
                    _this.markObjAsOfflineIfForced(result, force);
                    collection.update(result);
                }
                else {
                    _this.markObjAsOfflineIfForced(obj, force);
                    collection.insert(obj);
                }
            }
            else {
                var objInsertResult = collection.insert(obj);
                objInsertResult[keyNameToCompare] = _this.buildUniqueIDValue(isPersistentUrl); // objInsertResult.$loki + "";
                _this.markObjAsOfflineIfForced(objInsertResult, force);
                return _this.$common.cleanObject(collection.update(objInsertResult));
            }
        });
        return this.$common.cleanObjects(collection.find());
    };
    /**
     * Handle post create object from only simple json object
     * @param payload
     * @param isPersistentUrl
     * @param collection
     * @param force {Boolean} mark the object as offline
     * @returns {*}
     */
    RequestHandler.prototype.handlePostRootObjectPayload = function (payload, isPersistentUrl, collection, force) {
        var keyNameToCompare = (isPersistentUrl.uri.tokens.length > 1) ? isPersistentUrl.uri.tokens[1].name : '';
        if (keyNameToCompare && !payload.hasOwnProperty(keyNameToCompare)) {
            this.logger.info('get payload', 'does not have the key specified in the URL settings');
            payload[keyNameToCompare] = '';
            var insertResult = collection.insert(payload);
            if (insertResult) {
                insertResult[keyNameToCompare] = this.buildUniqueIDValue(isPersistentUrl); // insertResult.$loki + "";
                this.markObjAsOfflineIfForced(insertResult, force);
                return this.$common.cleanObject(collection.update(insertResult));
            }
            throw new Error('unable to store the payload object');
        }
        else if (keyNameToCompare && payload.hasOwnProperty(keyNameToCompare)) {
            var queryForObject = {};
            queryForObject[keyNameToCompare] = payload[keyNameToCompare];
            var result = collection.findOne(queryForObject);
            if (result) {
                this.$common.extendOwn(result, payload);
                this.markObjAsOfflineIfForced(result, force);
                return this.$common.cleanObject(collection.update(result));
            }
            payload[keyNameToCompare] = this.buildUniqueIDValue(isPersistentUrl, payload[keyNameToCompare]);
        }
        this.markObjAsOfflineIfForced(payload, force);
        return this.$common.cleanObject(collection.insert(payload));
    };
    /**
     * Handle Post HTTP request!
     *
     * @param response {persistenceRequestHandler~Response}
     * @param force - it means that the meta['offline-persist'] property will be deleted to force update on next GET
     * @returns {*}
     */
    RequestHandler.prototype.handlePost = function (response, force) {
        var parsed = this.$options.parseURL(response.url);
        var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
        if (!isPersistentUrl) {
            throw new Error('Persistence.RequestHandler.post() given URI not configured for persistence: ' + parsed.path);
        }
        var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
        var collection = this.$db.getCollectionByName(queryParams.root);
        var beforeSyncPayload = response.data;
        var keyValueObj = this.buildFindQueryBasedOnUrlParams(queryParams);
        if (!this.$common.isEmpty(keyValueObj)) {
            var result = collection.findOne(keyValueObj);
            if (result) {
                var newObj = this.createObjFromUrlParamsForExistingForPost(result, isPersistentUrl, queryParams, beforeSyncPayload);
                var propertyName = isPersistentUrl.uri.tokens[isPersistentUrl.uri.tokens.length - 1].name;
                newObj.result[propertyName] = this.buildUniqueIDValue(isPersistentUrl, newObj.result[propertyName]);
                this.markObjAsOfflineIfForced(newObj.obj, force);
                collection.update(newObj.obj);
                return this.$common.cleanObject(newObj.result);
            }
            else {
                var newObj = this.createObjFromUrlParamsForExistingForPost(keyValueObj, isPersistentUrl, queryParams, beforeSyncPayload);
                this.markObjAsOfflineIfForced(newObj.obj, force);
                collection.insert(newObj.obj);
                return this.$common.cleanObject(newObj.result);
            }
        }
        else {
            if (this.$common.isArray(beforeSyncPayload)) {
                return this.handlePostRootArrayPayload(beforeSyncPayload, isPersistentUrl, collection, force);
            }
            else if (this.$common.isObject(beforeSyncPayload)
                && !this.$common.isArray(beforeSyncPayload)
                && !this.$common.isNull(beforeSyncPayload)) {
                return this.handlePostRootObjectPayload(beforeSyncPayload, isPersistentUrl, collection, force);
            }
        }
        throw new Error('don\'t know what to do with the payload');
    };
    /**
     * Works like HTTP post
     * https://gist.github.com/wookiehangover/877067
     *
     * @param response
     * @param force
     * @returns {*}
     */
    RequestHandler.prototype.handlePut = function (response, force) {
        var parsed = this.$options.parseURL(response.url);
        var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
        if (!isPersistentUrl) {
            throw new Error('Persistence.RequestHandler.post() given URI not configured for persistence: ' + parsed.path);
        }
        var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
        var collection = this.$db.getCollectionByName(queryParams.root);
        var payload = response.data;
        var keyValueObj = this.buildFindQueryBasedOnUrlParams(queryParams);
        if (!this.$common.isEmpty(keyValueObj)) {
            var result = collection.findOne(keyValueObj);
            if (result) {
                var newObj = this.createObjFromUrlParamsForExistingForPost(result, isPersistentUrl, queryParams, payload);
                this.markObjAsOfflineIfForced(newObj.obj, force);
                collection.update(newObj.obj);
                return newObj.result;
            }
            else {
                var newObj = this.createObjFromUrlParamsForExistingForPost(keyValueObj, isPersistentUrl, queryParams, payload);
                this.markObjAsOfflineIfForced(newObj.obj, force);
                collection.insert(newObj.obj);
                return newObj.result;
            }
        }
        if (this.$common.isArray(payload)) {
            return this.handlePostRootArrayPayload(payload, isPersistentUrl, collection, force);
        }
        else if (this.$common.isObject(payload) && !this.$common.isArray(payload) && !this.$common.isNull(payload)) {
            return this.handlePostRootObjectPayload(payload, isPersistentUrl, collection, force);
        }
        throw new Error('no key specified to recognise obj in the database for editing!');
    };
    /**
     * Works like HTTP post
     * https://gist.github.com/wookiehangover/877067
     *
     * @param response
     * @param force
     * @returns {*}
     */
    RequestHandler.prototype.handlePatch = function (response, force) {
        var parsed = this.$options.parseURL(response.url);
        var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
        if (!isPersistentUrl) {
            throw new Error('Persistence.RequestHandler.post() given URI not configured for persistence: ' + parsed.path);
        }
        var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
        var collection = this.$db.getCollectionByName(queryParams.root);
        var payload = response.data;
        var keyValueObj = this.buildFindQueryBasedOnUrlParams(queryParams);
        if (!this.$common.isEmpty(keyValueObj)) {
            var result = collection.findOne(keyValueObj);
            if (result) {
                var newObj = this.createObjFromUrlParamsForExistingForPost(result, isPersistentUrl, queryParams, payload);
                this.markObjAsOfflineIfForced(newObj.obj, force);
                collection.update(newObj.obj);
                return newObj.result;
            }
            else {
                var newObj = this.createObjFromUrlParamsForExistingForPost(keyValueObj, isPersistentUrl, queryParams, payload);
                this.markObjAsOfflineIfForced(newObj.obj, force);
                collection.insert(newObj.obj);
                return newObj.result;
            }
        }
        if (this.$common.isArray(payload)) {
            return this.handlePostRootArrayPayload(payload, isPersistentUrl, collection, force);
        }
        else if (this.$common.isObject(payload) && !this.$common.isArray(payload) && !this.$common.isNull(payload)) {
            return this.handlePostRootObjectPayload(payload, isPersistentUrl, collection, force);
        }
        throw new Error('no key specified to recognise obj in the database for editing!');
    };
    /**
     * Delete specific element from the offline db
     *
     * @param request
     * @returns {*}
     */
    RequestHandler.prototype.handleDelete = function (request) {
        var parsed = this.$options.parseURL(request.url);
        var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
        if (!isPersistentUrl) {
            throw new Error('Persistence.RequestHandler.post() given URI not configured for persistence: ' + parsed.path);
        }
        var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
        var collection = this.$db.getCollectionByName(queryParams.root);
        var keyValueObj = this.buildFindQueryBasedOnUrlParams(queryParams);
        if (!this.$common.isEmpty(keyValueObj)) {
            var findOne = collection.findOne(keyValueObj);
            if (findOne) {
                return this.$common.cleanObject(collection.remove(findOne));
            }
            throw new Error('unable to find object with the given ID(%s) in the database');
        }
        if (request.hasOwnProperty('data')) {
            var payload = request.data;
            if (!this.$common.isEmpty(payload) && this.$common.isObject(payload) && !this.$common.isArray(payload)) {
                var keyNameToCompare = (isPersistentUrl.uri.tokens.length > 1) ? isPersistentUrl.uri.tokens[1].name : null;
                if (keyNameToCompare && !request.data.hasOwnProperty(keyNameToCompare)) {
                    throw new Error('payload does not have the key required to delete the object');
                }
                var findOne = collection.findOne({ keyNameToCompare: request.data[keyNameToCompare] });
                if (findOne) {
                    return this.$common.cleanObject(collection.remove(findOne));
                }
            }
        }
        this.logger.error('payload does not have the key required to delete the object in the payload');
        throw new Error('payload does not have the key required to delete the object in the payload');
    };
    RequestHandler.prototype.postSuccessOperations = function (obj) {
        if (obj.syncObj.method === 'POST') {
            var cpObj = this.$common.clone(obj);
            var parsed = this.$options.parseURL(cpObj.syncObj.url);
            var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
            if (!isPersistentUrl) {
                this.logger.debug('sync post success operation exist');
                return obj;
            }
            var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
            var collection = this.$db.getCollectionByName(queryParams.root);
            var beforeSyncPayload = cpObj.syncObj.data;
            var response = cpObj.response;
            var keyValueObj = this.buildFindQueryBasedOnUrlParams(queryParams);
            if (!this.$common.isEmpty(keyValueObj)) {
                var parent_1 = collection.findOne(keyValueObj);
                if (parent_1) {
                    var newObj = this.createObjFromUrlParamsForExistingForPost(parent_1, isPersistentUrl, queryParams, response, beforeSyncPayload);
                    var propertyName = isPersistentUrl.uri.tokens[isPersistentUrl.uri.tokens.length - 1].name;
                    newObj.result[propertyName] = this.buildUniqueIDValue(isPersistentUrl, newObj.result[propertyName]);
                    collection.update(newObj.obj);
                    return this.$common.cleanObject(newObj.result);
                }
                else {
                    var newObj = this.createObjFromUrlParamsForExistingForPost(keyValueObj, isPersistentUrl, queryParams, response);
                    collection.insert(newObj.obj);
                    return this.$common.cleanObject(newObj.result);
                }
            }
            else {
                var keyNameToCompare = (isPersistentUrl.uri.tokens.length > 1) ? isPersistentUrl.uri.tokens[1].name : '';
                if (keyNameToCompare && !beforeSyncPayload.hasOwnProperty(keyNameToCompare)) {
                    response = this.$common.extendOwn(beforeSyncPayload, response);
                    return this.$common.cleanObject(collection.insert(response));
                }
                else {
                    var queryForObject = {};
                    queryForObject[keyNameToCompare] = beforeSyncPayload[keyNameToCompare];
                    var result = collection.findOne(queryForObject);
                    this.$common.extendOwn(result, response);
                    return this.$common.cleanObject(collection.update(result));
                }
            }
        }
        return obj;
    };
    RequestHandler.prototype.flush = function (path) {
        var _this = this;
        this.logger.info('Persistence.RequestHandler.flush()', path);
        if (this.$common.isEmpty(path)) {
            return this.$db.flush();
        }
        else {
            var parsed_1 = this.$options.parseURL(path);
            var isPersistentUrl_1 = this.$utils.isPersistUrl(parsed_1.path);
            return new Promise(function (resolve, reject) {
                if (!isPersistentUrl_1) {
                    reject(new Error('Persistence.RequestHandler.flush() ' +
                        ("given URI not configured for persistence: " + parsed_1.path)));
                }
                else {
                    var queryParams = _this.$utils.extractKeyValuesFromUrl2(isPersistentUrl_1);
                    resolve(_this.$db.getCollectionByName(queryParams.root).removeDataOnly());
                }
            });
        }
    };
    RequestHandler.prototype.getDB = function () {
        return this.$db;
    };
    RequestHandler.prototype.get = function (request) {
        var _this = this;
        var doGet = function (request) {
            _this.logger.info('get()');
            _this.isPersistentGetRequest(request);
            var _request = _this.$common.clone(request);
            if (!_request.hasOwnProperty('data') || _this.$common.isEmpty(_request.data)) {
                return _this.$common.clone(_this.handleGet(_request));
            }
            return _this.$common.clone(_this.handleGetStore(_request));
        };
        return new Promise(function (resolve) {
            resolve(doGet(request));
        });
    };
    RequestHandler.prototype.post = function (request, force) {
        var _this = this;
        var doPost = function (request, force) {
            _this.logger.info('post()');
            _this.isPostRequest(request);
            var _request = _this.$common.clone(request);
            return _this.$common.clone(_this.handlePost(_request, force));
        };
        return new Promise(function (resolve) {
            resolve(doPost(request, force));
        });
    };
    RequestHandler.prototype.put = function (request, force) {
        var _this = this;
        var doPut = function (request, force) {
            _this.logger.info('put()');
            _this.isPostRequest(request);
            var _request = _this.$common.clone(request);
            return _this.$common.clone(_this.handlePut(_request, force));
        };
        return new Promise(function (resolve) {
            resolve(doPut(request, force));
        });
    };
    RequestHandler.prototype.patch = function (request, force) {
        var _this = this;
        var doPatch = function (request, force) {
            _this.logger.info('patch()');
            _this.isPostRequest(request);
            var _request = _this.$common.clone(request);
            return _this.$common.clone(_this.handlePatch(_request, force));
        };
        return new Promise(function (resolve) {
            resolve(doPatch(request, force));
        });
    };
    RequestHandler.prototype.delete = function (request) {
        var _this = this;
        var doDelete = function (request) {
            _this.logger.info('delete()');
            _this.isPersistentRequest(request);
            var _request = _this.$common.clone(request);
            return _this.$common.clone(_this.handleDelete(_request));
        };
        return new Promise(function (resolve) {
            resolve(doDelete(request));
        });
    };
    RequestHandler.prototype.data = function (path) {
        var _this = this;
        var doData = function (path) {
            _this.logger.info('data()');
            if (path == null) {
                throw new Error('Path cannot be empty!');
            }
            var parsed = _this.$options.parseURL(path);
            var isPersistentUrl = _this.$utils.isPersistUrl(parsed.path);
            if (!isPersistentUrl) {
                throw new Error('post() given URI not configured for persistence: ' + parsed.path);
            }
            var queryParams = _this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
            return _this.$db.getCollectionByName(queryParams.root);
        };
        return new Promise(function (resolve) {
            resolve(doData(path));
        });
    };
    RequestHandler.prototype.router = function (request, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        return new Promise(function (resolve) {
            if (!_this.isPersistentGetRequest(request)) {
                _this.logger.error('Passed object is not defined request for GET!', request.url);
                throw new Error('Passed object is not defined request for GET!');
            }
            if (!request.hasOwnProperty('method')) {
                _this.logger.error('request.method was not provided!', request);
                throw new Error('request.method was not provided!');
            }
            var _request = _this.$common.clone(request);
            _request.method = _this.$utils._normalizeMethod(_request.method);
            if (!_this[_request.method]) {
                _this.logger.error('specified router is not implemented!');
                throw new Error('specified router is not implemented!');
            }
            var result = _this[_request.method](_request, force);
            resolve(result);
        });
    };
    RequestHandler.prototype._createDatabase = function (dbAdapter) {
        return new db_1.DB(this.prefix + '.' + this.dbName, this.$options, dbAdapter);
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var user_1 = __webpack_require__(35);
var network_response_1 = __webpack_require__(2);
var authorization_1 = __webpack_require__(4);
var types_1 = __webpack_require__(0);
var AuthenticationResponse = /** @class */ (function (_super) {
    __extends(AuthenticationResponse, _super);
    function AuthenticationResponse(response, anonymousAccessToken) {
        var _this = _super.call(this, response.statusCode, response.data, response.headers) || this;
        _this.accessToken = anonymousAccessToken;
        return _this;
    }
    return AuthenticationResponse;
}(network_response_1.NetworkResponse));
exports.AuthenticationResponse = AuthenticationResponse;
/**
 * @class
 * @global
 * @classdesc Class used to authorize a mobile user against Oracle Mobile Cloud Enterprise.
 * Callers should use MobileBackend's [authorization]{@link Backend#authorization} property.
 * @abstract
 * @extends Authorization
 * @hideconstructor
 */
var MCSAuthorization = /** @class */ (function (_super) {
    __extends(MCSAuthorization, _super);
    function MCSAuthorization(backend, utils, platform) {
        var _this = _super.call(this, utils, platform) || this;
        _this.backend = backend;
        _this.utils = utils;
        _this.platform = platform;
        _this.logger = new logger_1.Logger('MCSAuthorization');
        return _this;
    }
    /**
     * Current user data object.
     * Object returned from getCurrentUser().
     * @typedef MCSAuthorization~CurrentUserData
     * @property statusCode {Number} Any HTTP status code returned from the server, if available.
     * @property user {User} The user resource returned by the service.
     */
    /**
     * Get current user data object.
     * Returns the user resource associated with the logged in user.
     * @return {Promise<MCSAuthorization~CurrentUserData|NetworkResponse>}
     * @function
     * @name MCSAuthorization#getCurrentUser
     * @example <caption>Example usage of mcs.mobileBackend.authorization.getCurrentUser()</caption>
     * mcs.mobileBackend.authorization.getCurrentUser().then(
     * function(data){
     * },
     * function(exception){
     * });
     * @example // Response example
     * {
     *     "id": "c9a5fdc5-737d-4e93-b292-d258ba334149",
     *     "username": "DwainDRob",
     *     "email": "js_sdk@mcs.com",
     *     "firstName": "Mobile",
     *     "lastName": "User",
     *     "properties": {}
     * }
     */
    MCSAuthorization.prototype.getCurrentUser = function () {
        return this.platform.invokeService({
            method: types_1.HttpMethods.GET,
            url: this.backend.getPlatformUrl('users/~'),
            headers: this.backend.getHttpHeaders(),
            module: types_1.ModuleNames.AUTHORIZATION,
        })
            .then(invokeServiceSuccess.bind(this), invokeServiceError.bind(this));
        function invokeServiceSuccess(response) {
            var user = !!response.data ? new user_1.User(response.data) : null;
            return { statusCode: response.statusCode, user: user };
        }
        function invokeServiceError(response) {
            return Promise.reject(response);
        }
    };
    /**
     * Authenticate success callback
     * @param {INetworkResponse} response
     * @param {string} accessToken
     * @private
     */
    MCSAuthorization.prototype._authenticateSuccess = function (response, accessToken) {
        this.logger.info('User logged in ' + response.statusCode);
        this._isAnonymous = false;
        this._isAuthorized = true;
        this._accessToken = accessToken;
        for (var i = 0; i < this._onAuthenticationCallbacks.length; i++) {
            this._onAuthenticationCallbacks[i](accessToken);
        }
    };
    /**
     * Returns the username of the current authorized user if any, null otherwise.
     * @return {String}
     */
    MCSAuthorization.prototype.getAuthorizedUserName = function () {
        throw Error('THis method is not supported by this authorization method.');
    };
    return MCSAuthorization;
}(authorization_1.Authorization));
exports.MCSAuthorization = MCSAuthorization;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * LokiJS
 * @author Joe Minichino <joe.minichino@gmail.com>
 *
 * A lightweight document oriented javascript database
 */
(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function () {

  return (function () {
    'use strict';

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    var Utils = {
      copyProperties: function (src, dest) {
        var prop;
        for (prop in src) {
          dest[prop] = src[prop];
        }
      },
      resolveTransformObject: function (subObj, params, depth) {
        var prop,
          pname;

        if (typeof depth !== 'number') {
          depth = 0;
        }

        if (++depth >= 10) return subObj;

        for (prop in subObj) {
          if (typeof subObj[prop] === 'string' && subObj[prop].indexOf("[%lktxp]") === 0) {
            pname = subObj[prop].substring(8);
            if (params.hasOwnProperty(pname)) {
              subObj[prop] = params[pname];
            }
          } else if (typeof subObj[prop] === "object") {
            subObj[prop] = Utils.resolveTransformObject(subObj[prop], params, depth);
          }
        }

        return subObj;
      },
      resolveTransformParams: function (transform, params) {
        var idx,
          clonedStep,
          resolvedTransform = [];

        if (typeof params === 'undefined') return transform;
        for (idx = 0; idx < transform.length; idx++) {
          clonedStep = clone(transform[idx], "shallow-recurse-objects");
          resolvedTransform.push(Utils.resolveTransformObject(clonedStep, params));
        }

        return resolvedTransform;
      }
    };
    var Comparators = {
      aeq: aeqHelper,
      lt: ltHelper,
      gt: gtHelper
    };

    /** Helper function for determining 'loki' abstract equality which is a little more abstract than ==
     *     aeqHelper(5, '5') === true
     *     aeqHelper(5.0, '5') === true
     *     aeqHelper(new Date("1/1/2011"), new Date("1/1/2011")) === true
     *     aeqHelper({a:1}, {z:4}) === true (all objects sorted equally)
     *     aeqHelper([1, 2, 3], [1, 3]) === false
     *     aeqHelper([1, 2, 3], [1, 2, 3]) === true
     *     aeqHelper(undefined, null) === true
     */
    function aeqHelper(prop1, prop2) {
      var cv1, cv2, t1, t2;

      if (prop1 === prop2) return true;
      if (!prop1 || !prop2 || prop1 === true || prop2 === true || prop1 !== prop1 || prop2 !== prop2) {
        switch (prop1) {
          case undefined: t1 = 1; break;
          case null: t1 = 1; break;
          case false: t1 = 3; break;
          case true: t1 = 4; break;
          case "": t1 = 5; break;
          default: t1 = (prop1 === prop1)?9:0; break;
        }

        switch (prop2) {
          case undefined: t2 = 1; break;
          case null: t2 = 1; break;
          case false: t2 = 3; break;
          case true: t2 = 4; break;
          case "": t2 = 5; break;
          default: t2 = (prop2 === prop2)?9:0; break;
        }
        if (t1 !== 9 || t2 !== 9) {
          return (t1===t2);
        }
      }
      cv1 = Number(prop1);
      cv2 = Number(prop2);
      if (cv1 === cv1 || cv2 === cv2) {
        return (cv1 === cv2);
      }
      cv1 = prop1.toString();
      cv2 = prop2.toString();

      return (cv1 == cv2);
    }

    /** Helper function for determining 'less-than' conditions for ops, sorting, and binary indices.
     *     In the future we might want $lt and $gt ops to use their own functionality/helper.
     *     Since binary indices on a property might need to index [12, NaN, new Date(), Infinity], we
     *     need this function (as well as gtHelper) to always ensure one value is LT, GT, or EQ to another.
     */
    function ltHelper(prop1, prop2, equal) {
      var cv1, cv2, t1, t2;
      if (!prop1 || !prop2 || prop1 === true || prop2 === true || prop1 !== prop1 || prop2 !== prop2) {
        switch (prop1) {
          case undefined: t1 = 1; break;
          case null: t1 = 1; break;
          case false: t1 = 3; break;
          case true: t1 = 4; break;
          case "": t1 = 5; break;
          default: t1 = (prop1 === prop1)?9:0; break;
        }

        switch (prop2) {
          case undefined: t2 = 1; break;
          case null: t2 = 1; break;
          case false: t2 = 3; break;
          case true: t2 = 4; break;
          case "": t2 = 5; break;
          default: t2 = (prop2 === prop2)?9:0; break;
        }
        if (t1 !== 9 || t2 !== 9) {
          return (t1===t2)?equal:(t1<t2);
        }
      }
      cv1 = Number(prop1);
      cv2 = Number(prop2);

      if (cv1 === cv1 && cv2 === cv2) {
        if (cv1 < cv2) return true;
        if (cv1 > cv2) return false;
        return equal;
      }

      if (cv1 === cv1 && cv2 !== cv2) {
        return true;
      }

      if (cv2 === cv2 && cv1 !== cv1) {
        return false;
      }

      if (prop1 < prop2) return true;
      if (prop1 > prop2) return false;
      if (prop1 == prop2) return equal;
      cv1 = prop1.toString();
      cv2 = prop2.toString();

      if (cv1 < cv2) {
        return true;
      }

      if (cv1 == cv2) {
        return equal;
      }

      return false;
    }

    function gtHelper(prop1, prop2, equal) {
      var cv1, cv2, t1, t2;
      if (!prop1 || !prop2 || prop1 === true || prop2 === true || prop1 !== prop1 || prop2 !== prop2) {
        switch (prop1) {
          case undefined: t1 = 1; break;
          case null: t1 = 1; break;
          case false: t1 = 3; break;
          case true: t1 = 4; break;
          case "": t1 = 5; break;
          default: t1 = (prop1 === prop1)?9:0; break;
        }

        switch (prop2) {
          case undefined: t2 = 1; break;
          case null: t2 = 1; break;
          case false: t2 = 3; break;
          case true: t2 = 4; break;
          case "": t2 = 5; break;
          default: t2 = (prop2 === prop2)?9:0; break;
        }
        if (t1 !== 9 || t2 !== 9) {
          return (t1===t2)?equal:(t1>t2);
        }
      }
      cv1 = Number(prop1);
      cv2 = Number(prop2);
      if (cv1 === cv1 && cv2 === cv2) {
        if (cv1 > cv2) return true;
        if (cv1 < cv2) return false;
        return equal;
      }

      if (cv1 === cv1 && cv2 !== cv2) {
        return false;
      }

      if (cv2 === cv2 && cv1 !== cv1) {
        return true;
      }

      if (prop1 > prop2) return true;
      if (prop1 < prop2) return false;
      if (prop1 == prop2) return equal;
      cv1 = prop1.toString();
      cv2 = prop2.toString();

      if (cv1 > cv2) {
        return true;
      }

      if (cv1 == cv2) {
        return equal;
      }

      return false;
    }

    function sortHelper(prop1, prop2, desc) {
      if (Comparators.aeq(prop1, prop2)) return 0;

      if (Comparators.lt(prop1, prop2, false)) {
        return (desc) ? (1) : (-1);
      }

      if (Comparators.gt(prop1, prop2, false)) {
        return (desc) ? (-1) : (1);
      }
      return 0;
    }

    /**
     * compoundeval() - helper function for compoundsort(), performing individual object comparisons
     *
     * @param {array} properties - array of property names, in order, by which to evaluate sort order
     * @param {object} obj1 - first object to compare
     * @param {object} obj2 - second object to compare
     * @returns {integer} 0, -1, or 1 to designate if identical (sortwise) or which should be first
     */
    function compoundeval(properties, obj1, obj2) {
      var res = 0;
      var prop, field, val1, val2, arr;
      for (var i = 0, len = properties.length; i < len; i++) {
        prop = properties[i];
        field = prop[0];
        if (~field.indexOf('.')) {
          arr = field.split('.');
          val1 = arr.reduce(function(obj, i) { return obj && obj[i] || undefined; }, obj1);
          val2 = arr.reduce(function(obj, i) { return obj && obj[i] || undefined; }, obj2);
        } else {
          val1 = obj1[field];
          val2 = obj2[field];
        }
        res = sortHelper(val1, val2, prop[1]);
        if (res !== 0) {
          return res;
        }
      }
      return 0;
    }

    /**
     * dotSubScan - helper function used for dot notation queries.
     *
     * @param {object} root - object to traverse
     * @param {array} paths - array of properties to drill into
     * @param {function} fun - evaluation function to test with
     * @param {any} value - comparative value to also pass to (compare) fun
     * @param {number} poffset - index of the item in 'paths' to start the sub-scan from
     */
    function dotSubScan(root, paths, fun, value, poffset) {
      var pathOffset = poffset || 0;
      var path = paths[pathOffset];
      if (root === undefined || root === null || !hasOwnProperty.call(root, path)) {
        return false;
      }

      var valueFound = false;
      var element = root[path];
      if (pathOffset + 1 >= paths.length) {
        valueFound = fun(element, value);
      } else if (Array.isArray(element)) {
        for (var index = 0, len = element.length; index < len; index += 1) {
          valueFound = dotSubScan(element[index], paths, fun, value, pathOffset + 1);
          if (valueFound === true) {
            break;
          }
        }
      } else {
        valueFound = dotSubScan(element, paths, fun, value, pathOffset + 1);
      }

      return valueFound;
    }

    function containsCheckFn(a) {
      if (typeof a === 'string' || Array.isArray(a)) {
        return function (b) {
          return a.indexOf(b) !== -1;
        };
      } else if (typeof a === 'object' && a !== null) {
        return function (b) {
          return hasOwnProperty.call(a, b);
        };
      }
      return null;
    }

    function doQueryOp(val, op) {
      for (var p in op) {
        if (hasOwnProperty.call(op, p)) {
          return LokiOps[p](val, op[p]);
        }
      }
      return false;
    }

    var LokiOps = {
      $eq: function (a, b) {
        return a === b;
      },
      $aeq: function (a, b) {
        return a == b;
      },

      $ne: function (a, b) {
        if (b !== b) {
          return (a === a);
        }

        return a !== b;
      },
      $dteq: function (a, b) {
        return Comparators.aeq(a, b);
      },
      $gt: function (a, b) {
        return Comparators.gt(a, b, false);
      },

      $gte: function (a, b) {
        return Comparators.gt(a, b, true);
      },

      $lt: function (a, b) {
        return Comparators.lt(a, b, false);
      },

      $lte: function (a, b) {
        return Comparators.lt(a, b, true);
      },
      $jgt: function (a, b) {
        return a > b;
      },

      $jgte: function (a, b) {
        return a >= b;
      },

      $jlt: function (a, b) {
        return a < b;
      },

      $jlte: function (a, b) {
        return a <= b;
      },
      $between: function (a, vals) {
        if (a === undefined || a === null) return false;
        return (Comparators.gt(a, vals[0], true) && Comparators.lt(a, vals[1], true));
      },

      $jbetween: function (a, vals) {
        if (a === undefined || a === null) return false;
        return (a >= vals[0] && a <= vals[1]);
      },

      $in: function (a, b) {
        return b.indexOf(a) !== -1;
      },

      $nin: function (a, b) {
        return b.indexOf(a) === -1;
      },

      $keyin: function (a, b) {
        return a in b;
      },

      $nkeyin: function (a, b) {
        return !(a in b);
      },

      $definedin: function (a, b) {
        return b[a] !== undefined;
      },

      $undefinedin: function (a, b) {
        return b[a] === undefined;
      },

      $regex: function (a, b) {
        return b.test(a);
      },

      $containsString: function (a, b) {
        return (typeof a === 'string') && (a.indexOf(b) !== -1);
      },

      $containsNone: function (a, b) {
        return !LokiOps.$containsAny(a, b);
      },

      $containsAny: function (a, b) {
        var checkFn = containsCheckFn(a);
        if (checkFn !== null) {
          return (Array.isArray(b)) ? (b.some(checkFn)) : (checkFn(b));
        }
        return false;
      },

      $contains: function (a, b) {
        var checkFn = containsCheckFn(a);
        if (checkFn !== null) {
          return (Array.isArray(b)) ? (b.every(checkFn)) : (checkFn(b));
        }
        return false;
      },

      $type: function (a, b) {
        var type = typeof a;
        if (type === 'object') {
          if (Array.isArray(a)) {
            type = 'array';
          } else if (a instanceof Date) {
            type = 'date';
          }
        }
        return (typeof b !== 'object') ? (type === b) : doQueryOp(type, b);
      },

      $finite: function(a, b) {
        return (b === isFinite(a));
      },

      $size: function (a, b) {
        if (Array.isArray(a)) {
          return (typeof b !== 'object') ? (a.length === b) : doQueryOp(a.length, b);
        }
        return false;
      },

      $len: function (a, b) {
        if (typeof a === 'string') {
          return (typeof b !== 'object') ? (a.length === b) : doQueryOp(a.length, b);
        }
        return false;
      },

      $where: function (a, b) {
        return b(a) === true;
      },
      $not: function (a, b) {
        return !doQueryOp(a, b);
      },

      $and: function (a, b) {
        for (var idx = 0, len = b.length; idx < len; idx += 1) {
          if (!doQueryOp(a, b[idx])) {
            return false;
          }
        }
        return true;
      },

      $or: function (a, b) {
        for (var idx = 0, len = b.length; idx < len; idx += 1) {
          if (doQueryOp(a, b[idx])) {
            return true;
          }
        }
        return false;
      }
    };
    var indexedOps = {
      $eq: LokiOps.$eq,
      $aeq: true,
      $dteq: true,
      $gt: true,
      $gte: true,
      $lt: true,
      $lte: true,
      $in: true,
      $between: true
    };

    function clone(data, method) {
      if (data === null || data === undefined) {
        return null;
      }

      var cloneMethod = method || 'parse-stringify',
        cloned;

      switch (cloneMethod) {
      case "parse-stringify":
        cloned = JSON.parse(JSON.stringify(data));
        break;
      case "jquery-extend-deep":
        cloned = jQuery.extend(true, {}, data);
        break;
      case "shallow":
        cloned = Object.create(data.constructor.prototype);
        Object.keys(data).map(function (i) {
          cloned[i] = data[i];
        });
        break;
      case "shallow-assign":
        cloned = Object.create(data.constructor.prototype);
        Object.assign(cloned, data);
        break;
      case "shallow-recurse-objects":
        cloned = clone(data, "shallow");
        var keys = Object.keys(data);
        keys.forEach(function(key) {
          if (typeof data[key] === "object" && data[key].constructor.name === "Object")  {
            cloned[key] = clone(data[key], "shallow-recurse-objects");
          }
        });
        break;
      default:
        break;
      }

      return cloned;
    }

    function cloneObjectArray(objarray, method) {
      var i,
        result = [];

      if (method == "parse-stringify") {
        return clone(objarray, method);
      }

      i = objarray.length - 1;

      for (; i <= 0; i--) {
        result.push(clone(objarray[i], method));
      }

      return result;
    }

    function localStorageAvailable() {
      try {
        return (window && window.localStorage !== undefined && window.localStorage !== null);
      } catch (e) {
        return false;
      }
    }


    /**
     * LokiEventEmitter is a minimalist version of EventEmitter. It enables any
     * constructor that inherits EventEmitter to emit events and trigger
     * listeners that have been added to the event through the on(event, callback) method
     *
     * @constructor LokiEventEmitter
     */
    function LokiEventEmitter() {}

    /**
     * @prop {hashmap} events - a hashmap, with each property being an array of callbacks
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.events = {};

    /**
     * @prop {boolean} asyncListeners - boolean determines whether or not the callbacks associated with each event
     * should happen in an async fashion or not
     * Default is false, which means events are synchronous
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.asyncListeners = false;

    /**
     * on(eventName, listener) - adds a listener to the queue of callbacks associated to an event
     * @param {string|string[]} eventName - the name(s) of the event(s) to listen to
     * @param {function} listener - callback function of listener to attach
     * @returns {int} the index of the callback in the array of listeners for a particular event
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.on = function (eventName, listener) {
      var event;
      var self = this;

      if (Array.isArray(eventName)) {
        eventName.forEach(function(currentEventName) {
          self.on(currentEventName, listener);
        });
        return listener;
      }

      event = this.events[eventName];
      if (!event) {
        event = this.events[eventName] = [];
      }
      event.push(listener);
      return listener;
    };

    /**
     * emit(eventName, data) - emits a particular event
     * with the option of passing optional parameters which are going to be processed by the callback
     * provided signatures match (i.e. if passing emit(event, arg0, arg1) the listener should take two parameters)
     * @param {string} eventName - the name of the event
     * @param {object=} data - optional object passed with the event
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.emit = function (eventName) {
      var self = this;
      var selfArgs = Array.prototype.slice.call(arguments, 1);
      if (eventName && this.events[eventName]) {
        this.events[eventName].forEach(function (listener) {
          if (self.asyncListeners) {
            setTimeout(function () {
              listener.apply(self, selfArgs);
            }, 1);
          } else {
            listener.apply(self, selfArgs);
          }

        });
      } else {
        throw new Error('No event ' + eventName + ' defined');
      }
    };

    /**
     * Alias of LokiEventEmitter.prototype.on
     * addListener(eventName, listener) - adds a listener to the queue of callbacks associated to an event
     * @param {string|string[]} eventName - the name(s) of the event(s) to listen to
     * @param {function} listener - callback function of listener to attach
     * @returns {int} the index of the callback in the array of listeners for a particular event
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.addListener = LokiEventEmitter.prototype.on;

    /**
     * removeListener() - removes the listener at position 'index' from the event 'eventName'
     * @param {string|string[]} eventName - the name(s) of the event(s) which the listener is attached to
     * @param {function} listener - the listener callback function to remove from emitter
     * @memberof LokiEventEmitter
     */
    LokiEventEmitter.prototype.removeListener = function (eventName, listener) {
      var self = this;

      if (Array.isArray(eventName)) {
        eventName.forEach(function(currentEventName) {
          self.removeListener(currentEventName, listener);
        });

        return;
      }

      if (this.events[eventName]) {
        var listeners = this.events[eventName];
        listeners.splice(listeners.indexOf(listener), 1);
      }
    };

    /**
     * Loki: The main database class
     * @constructor Loki
     * @implements LokiEventEmitter
     * @param {string} filename - name of the file to be saved to
     * @param {object=} options - (Optional) config options object
     * @param {string} options.env - override environment detection as 'NODEJS', 'BROWSER', 'CORDOVA'
     * @param {boolean} [options.verbose=false] - enable console output
     * @param {boolean} [options.autosave=false] - enables autosave
     * @param {int} [options.autosaveInterval=5000] - time interval (in milliseconds) between saves (if dirty)
     * @param {boolean} [options.autoload=false] - enables autoload on loki instantiation
     * @param {function} options.autoloadCallback - user callback called after database load
     * @param {adapter} options.adapter - an instance of a loki persistence adapter
     * @param {string} [options.serializationMethod='normal'] - ['normal', 'pretty', 'destructured']
     * @param {string} options.destructureDelimiter - string delimiter used for destructured serialization
     * @param {boolean} [options.throttledSaves=true] - debounces multiple calls to to saveDatabase reducing number of disk I/O operations
                                                and guaranteeing proper serialization of the calls.
     */
    function Loki(filename, options) {
      this.filename = filename || 'loki.db';
      this.collections = [];
      this.databaseVersion = 1.5;
      this.engineVersion = 1.5;
      this.autosave = false;
      this.autosaveInterval = 5000;
      this.autosaveHandle = null;
      this.throttledSaves = true;

      this.options = {};
      this.persistenceMethod = null;
      this.persistenceAdapter = null;
      this.throttledSavePending = false;
      this.throttledCallbacks = [];
      this.verbose = options && options.hasOwnProperty('verbose') ? options.verbose : false;

      this.events = {
        'init': [],
        'loaded': [],
        'flushChanges': [],
        'close': [],
        'changes': [],
        'warning': []
      };

      var getENV = function () {
        if (typeof global !== 'undefined' && (global.android || global.NSObject)) {
           return 'NATIVESCRIPT'; //nativescript
        }

        if (typeof window === 'undefined') {
          return 'NODEJS';
        }

        if (typeof global !== 'undefined' && global.window && process) {
          return 'NODEJS'; //node-webkit
        }

        if (typeof document !== 'undefined') {
          if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
            return 'CORDOVA';
          }
          return 'BROWSER';
        }
        return 'CORDOVA';
      };
      if (options && options.hasOwnProperty('env')) {
        this.ENV = options.env;
      } else {
        this.ENV = getENV();
      }
      if (this.ENV === 'undefined') {
        this.ENV = 'NODEJS';
      }

      this.configureOptions(options, true);

      this.on('init', this.clearChanges);

    }
    Loki.prototype = new LokiEventEmitter();
    Loki.prototype.constructor = Loki;
    Loki.prototype.getIndexedAdapter = function () {
      var adapter;

      if (true) {
        adapter = __webpack_require__(12);
      }

      return adapter;
    };


    /**
     * Allows reconfiguring database options
     *
     * @param {object} options - configuration options to apply to loki db object
     * @param {string} options.env - override environment detection as 'NODEJS', 'BROWSER', 'CORDOVA'
     * @param {boolean} options.verbose - enable console output (default is 'false')
     * @param {boolean} options.autosave - enables autosave
     * @param {int} options.autosaveInterval - time interval (in milliseconds) between saves (if dirty)
     * @param {boolean} options.autoload - enables autoload on loki instantiation
     * @param {function} options.autoloadCallback - user callback called after database load
     * @param {adapter} options.adapter - an instance of a loki persistence adapter
     * @param {string} options.serializationMethod - ['normal', 'pretty', 'destructured']
     * @param {string} options.destructureDelimiter - string delimiter used for destructured serialization
     * @param {boolean} initialConfig - (internal) true is passed when loki ctor is invoking
     * @memberof Loki
     */
    Loki.prototype.configureOptions = function (options, initialConfig) {
      var defaultPersistence = {
          'NODEJS': 'fs',
          'BROWSER': 'localStorage',
          'CORDOVA': 'localStorage',
          'MEMORY': 'memory'
        },
        persistenceMethods = {
          'fs': LokiFsAdapter,
          'localStorage': LokiLocalStorageAdapter,
          'memory': LokiMemoryAdapter
        };

      this.options = {};

      this.persistenceMethod = null;
      this.persistenceAdapter = null;
      if (typeof (options) !== 'undefined') {
        this.options = options;

        if (this.options.hasOwnProperty('persistenceMethod')) {
          if (typeof (persistenceMethods[options.persistenceMethod]) == 'function') {
            this.persistenceMethod = options.persistenceMethod;
            this.persistenceAdapter = new persistenceMethods[options.persistenceMethod]();
          }
        }
        if (this.options.hasOwnProperty('adapter')) {
          this.persistenceMethod = 'adapter';
          this.persistenceAdapter = options.adapter;
          this.options.adapter = null;
        }
        if (options.autoload && initialConfig) {
          var self = this;
          setTimeout(function () {
            self.loadDatabase(options, options.autoloadCallback);
          }, 1);
        }

        if (this.options.hasOwnProperty('autosaveInterval')) {
          this.autosaveDisable();
          this.autosaveInterval = parseInt(this.options.autosaveInterval, 10);
        }

        if (this.options.hasOwnProperty('autosave') && this.options.autosave) {
          this.autosaveDisable();
          this.autosave = true;

          if (this.options.hasOwnProperty('autosaveCallback')) {
            this.autosaveEnable(options, options.autosaveCallback);
          } else {
            this.autosaveEnable();
          }
        }

        if (this.options.hasOwnProperty('throttledSaves')) {
          this.throttledSaves = this.options.throttledSaves;
        }
      } // end of options processing
      if (!this.options.hasOwnProperty('serializationMethod')) {
        this.options.serializationMethod = 'normal';
      }
      if (!this.options.hasOwnProperty('destructureDelimiter')) {
        this.options.destructureDelimiter = '$<\n';
      }
      if (this.persistenceAdapter === null) {
        this.persistenceMethod = defaultPersistence[this.ENV];
        if (this.persistenceMethod) {
          this.persistenceAdapter = new persistenceMethods[this.persistenceMethod]();
        }
      }

    };

    /**
     * Copies 'this' database into a new Loki instance. Object references are shared to make lightweight.
     *
     * @param {object} options - apply or override collection level settings
     * @param {bool} options.removeNonSerializable - nulls properties not safe for serialization.
     * @memberof Loki
     */
    Loki.prototype.copy = function(options) {
      var databaseCopy = new Loki(this.filename, { env: "NA" });
      var clen, idx;

      options = options || {};
      databaseCopy.loadJSONObject(this, { retainDirtyFlags: true });
      if(options.hasOwnProperty("removeNonSerializable") && options.removeNonSerializable === true) {
        databaseCopy.autosaveHandle = null;
        databaseCopy.persistenceAdapter = null;

        clen = databaseCopy.collections.length;
        for (idx=0; idx<clen; idx++) {
          databaseCopy.collections[idx].constraints = null;
          databaseCopy.collections[idx].ttl = null;
        }
      }

      return databaseCopy;
    };

    /**
     * Adds a collection to the database.
     * @param {string} name - name of collection to add
     * @param {object=} options - (optional) options to configure collection with.
     * @param {array=} [options.unique=[]] - array of property names to define unique constraints for
     * @param {array=} [options.exact=[]] - array of property names to define exact constraints for
     * @param {array=} [options.indices=[]] - array property names to define binary indexes for
     * @param {boolean} [options.asyncListeners=false] - whether listeners are called asynchronously
     * @param {boolean} [options.disableMeta=false] - set to true to disable meta property on documents
     * @param {boolean} [options.disableChangesApi=true] - set to false to enable Changes Api
     * @param {boolean} [options.disableDeltaChangesApi=true] - set to false to enable Delta Changes API (requires Changes API, forces cloning)
     * @param {boolean} [options.autoupdate=false] - use Object.observe to update objects automatically
     * @param {boolean} [options.clone=false] - specify whether inserts and queries clone to/from user
     * @param {string} [options.cloneMethod='parse-stringify'] - 'parse-stringify', 'jquery-extend-deep', 'shallow, 'shallow-assign'
     * @param {int=} options.ttl - age of document (in ms.) before document is considered aged/stale.
     * @param {int=} options.ttlInterval - time interval for clearing out 'aged' documents; not set by default.
     * @returns {Collection} a reference to the collection which was just added
     * @memberof Loki
     */
    Loki.prototype.addCollection = function (name, options) {
      var i,
        len = this.collections.length;

      if (options && options.disableMeta === true) {
        if (options.disableChangesApi === false) {
          throw new Error("disableMeta option cannot be passed as true when disableChangesApi is passed as false");
        }
        if (options.disableDeltaChangesApi === false) {
          throw new Error("disableMeta option cannot be passed as true when disableDeltaChangesApi is passed as false");
        }
        if (typeof options.ttl === "number" && options.ttl > 0) {
          throw new Error("disableMeta option cannot be passed as true when ttl is enabled");
        }
      }

      for (i = 0; i < len; i += 1) {
        if (this.collections[i].name === name) {
          return this.collections[i];
        }
      }

      var collection = new Collection(name, options);
      this.collections.push(collection);

      if (this.verbose)
        collection.console = console;

      return collection;
    };

    Loki.prototype.loadCollection = function (collection) {
      if (!collection.name) {
        throw new Error('Collection must have a name property to be loaded');
      }
      this.collections.push(collection);
    };

    /**
     * Retrieves reference to a collection by name.
     * @param {string} collectionName - name of collection to look up
     * @returns {Collection} Reference to collection in database by that name, or null if not found
     * @memberof Loki
     */
    Loki.prototype.getCollection = function (collectionName) {
      var i,
        len = this.collections.length;

      for (i = 0; i < len; i += 1) {
        if (this.collections[i].name === collectionName) {
          return this.collections[i];
        }
      }
      this.emit('warning', 'collection ' + collectionName + ' not found');
      return null;
    };

    /**
     * Renames an existing loki collection
     * @param {string} oldName - name of collection to rename
     * @param {string} newName - new name of collection
     * @returns {Collection} reference to the newly renamed collection
     * @memberof Loki
     */
    Loki.prototype.renameCollection = function (oldName, newName) {
      var c = this.getCollection(oldName);

      if (c) {
        c.name = newName;
      }

      return c;
    };

    /**
     * Returns a list of collections in the database.
     * @returns {object[]} array of objects containing 'name', 'type', and 'count' properties.
     * @memberof Loki
     */
    Loki.prototype.listCollections = function () {

      var i = this.collections.length,
        colls = [];

      while (i--) {
        colls.push({
          name: this.collections[i].name,
          type: this.collections[i].objType,
          count: this.collections[i].data.length
        });
      }
      return colls;
    };

    /**
     * Removes a collection from the database.
     * @param {string} collectionName - name of collection to remove
     * @memberof Loki
     */
    Loki.prototype.removeCollection = function (collectionName) {
      var i,
        len = this.collections.length;

      for (i = 0; i < len; i += 1) {
        if (this.collections[i].name === collectionName) {
          var tmpcol = new Collection(collectionName, {});
          var curcol = this.collections[i];
          for (var prop in curcol) {
            if (curcol.hasOwnProperty(prop) && tmpcol.hasOwnProperty(prop)) {
              curcol[prop] = tmpcol[prop];
            }
          }
          this.collections.splice(i, 1);
          return;
        }
      }
    };

    Loki.prototype.getName = function () {
      return this.name;
    };

    /**
     * serializeReplacer - used to prevent certain properties from being serialized
     *
     */
    Loki.prototype.serializeReplacer = function (key, value) {
      switch (key) {
      case 'autosaveHandle':
      case 'persistenceAdapter':
      case 'constraints':
      case 'ttl':
        return null;
      case 'throttledSavePending':
      case 'throttledCallbacks':
        return undefined;
      default:
        return value;
      }
    };

    /**
     * Serialize database to a string which can be loaded via {@link Loki#loadJSON}
     *
     * @returns {string} Stringified representation of the loki database.
     * @memberof Loki
     */
    Loki.prototype.serialize = function (options) {
      options = options || {};

      if (!options.hasOwnProperty("serializationMethod")) {
        options.serializationMethod = this.options.serializationMethod;
      }

      switch(options.serializationMethod) {
        case "normal": return JSON.stringify(this, this.serializeReplacer);
        case "pretty": return JSON.stringify(this, this.serializeReplacer, 2);
        case "destructured": return this.serializeDestructured(); // use default options
        default: return JSON.stringify(this, this.serializeReplacer);
      }
    };
    Loki.prototype.toJson = Loki.prototype.serialize;

    /**
     * Database level destructured JSON serialization routine to allow alternate serialization methods.
     * Internally, Loki supports destructuring via loki "serializationMethod' option and
     * the optional LokiPartitioningAdapter class. It is also available if you wish to do
     * your own structured persistence or data exchange.
     *
     * @param {object=} options - output format options for use externally to loki
     * @param {bool=} options.partitioned - (default: false) whether db and each collection are separate
     * @param {int=} options.partition - can be used to only output an individual collection or db (-1)
     * @param {bool=} options.delimited - (default: true) whether subitems are delimited or subarrays
     * @param {string=} options.delimiter - override default delimiter
     *
     * @returns {string|array} A custom, restructured aggregation of independent serializations.
     * @memberof Loki
     */
    Loki.prototype.serializeDestructured = function(options) {
      var idx, sidx, result, resultlen;
      var reconstruct = [];
      var dbcopy;

      options = options || {};

      if (!options.hasOwnProperty("partitioned")) {
        options.partitioned = false;
      }

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("delimiter")) {
        options.delimiter = this.options.destructureDelimiter;
      }
      if (options.partitioned === true && options.hasOwnProperty("partition") && options.partition >= 0) {
        return this.serializeCollection({
          delimited: options.delimited,
          delimiter: options.delimiter,
          collectionIndex: options.partition
        });
      }
      dbcopy = new Loki(this.filename);
      dbcopy.loadJSONObject(this);

      for(idx=0; idx < dbcopy.collections.length; idx++) {
        dbcopy.collections[idx].data = [];
      }
      if (options.partitioned === true && options.partition === -1) {
        return dbcopy.serialize({
          serializationMethod: "normal"
        });
      }
      reconstruct.push(dbcopy.serialize({
          serializationMethod: "normal"
      }));

      dbcopy = null;
      for(idx=0; idx < this.collections.length; idx++) {
        result = this.serializeCollection({
          delimited: options.delimited,
          delimiter: options.delimiter,
          collectionIndex: idx
        });
        if (options.partitioned === false && options.delimited === false) {
          if (!Array.isArray(result)) {
            throw new Error("a nondelimited, non partitioned collection serialization did not return an expected array");
          }
          resultlen = result.length;

          for (sidx=0; sidx < resultlen; sidx++) {
            reconstruct.push(result[sidx]);
            result[sidx] = null;
          }

          reconstruct.push("");
        }
        else {
          reconstruct.push(result);
        }
      }
      if (options.partitioned) {
        if (options.delimited) {
          return reconstruct;
        }
        else {
          return reconstruct;
        }
      }
      else {
        if (options.delimited) {
          reconstruct.push("");

          return reconstruct.join(options.delimiter);
        }
        else {
          reconstruct.push("");

          return reconstruct;
        }
      }

      reconstruct.push("");

      return reconstruct.join(delim);
    };

    /**
     * Collection level utility method to serialize a collection in a 'destructured' format
     *
     * @param {object=} options - used to determine output of method
     * @param {int} options.delimited - whether to return single delimited string or an array
     * @param {string} options.delimiter - (optional) if delimited, this is delimiter to use
     * @param {int} options.collectionIndex -  specify which collection to serialize data for
     *
     * @returns {string|array} A custom, restructured aggregation of independent serializations for a single collection.
     * @memberof Loki
     */
    Loki.prototype.serializeCollection = function(options) {
      var doccount,
        docidx,
        resultlines = [];

      options = options || {};

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("collectionIndex")) {
        throw new Error("serializeCollection called without 'collectionIndex' option");
      }

      doccount = this.collections[options.collectionIndex].data.length;

      resultlines = [];

      for(docidx=0; docidx<doccount; docidx++) {
        resultlines.push(JSON.stringify(this.collections[options.collectionIndex].data[docidx]));
      }
      if (options.delimited) {
        resultlines.push("");

        return resultlines.join(options.delimiter);
      }
      else {
        return resultlines;
      }
    };

    /**
     * Database level destructured JSON deserialization routine to minimize memory overhead.
     * Internally, Loki supports destructuring via loki "serializationMethod' option and
     * the optional LokiPartitioningAdapter class. It is also available if you wish to do
     * your own structured persistence or data exchange.
     *
     * @param {string|array} destructuredSource - destructured json or array to deserialize from
     * @param {object=} options - source format options
     * @param {bool=} [options.partitioned=false] - whether db and each collection are separate
     * @param {int=} options.partition - can be used to deserialize only a single partition
     * @param {bool=} [options.delimited=true] - whether subitems are delimited or subarrays
     * @param {string=} options.delimiter - override default delimiter
     *
     * @returns {object|array} An object representation of the deserialized database, not yet applied to 'this' db or document array
     * @memberof Loki
     */
    Loki.prototype.deserializeDestructured = function(destructuredSource, options) {
      var workarray=[];
      var len, cdb;
      var idx, collIndex=0, collCount, lineIndex=1, done=false;
      var currLine, currObject;

      options = options || {};

      if (!options.hasOwnProperty("partitioned")) {
        options.partitioned = false;
      }

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("delimiter")) {
        options.delimiter = this.options.destructureDelimiter;
      }
      if (options.partitioned) {
        if (options.hasOwnProperty('partition')) {
          if (options.partition === -1) {
            cdb = JSON.parse(destructuredSource[0]);

            return cdb;
          }
          return this.deserializeCollection(destructuredSource[options.partition+1], options);
        }
        cdb = JSON.parse(destructuredSource[0]);
        collCount = cdb.collections.length;
        for(collIndex=0; collIndex<collCount; collIndex++) {
          cdb.collections[collIndex].data = this.deserializeCollection(destructuredSource[collIndex+1], options);
        }

        return cdb;
      }
      if (options.delimited) {
        workarray = destructuredSource.split(options.delimiter);
        destructuredSource = null; // lower memory pressure
        len = workarray.length;

        if (len === 0) {
          return null;
        }
      }
      else {
        workarray = destructuredSource;
      }
      cdb = JSON.parse(workarray[0]);
      collCount = cdb.collections.length;
      workarray[0] = null;

      while (!done) {
        currLine = workarray[lineIndex];
        if (workarray[lineIndex] === "") {
          if (++collIndex > collCount) {
            done = true;
          }
        }
        else {
          currObject = JSON.parse(workarray[lineIndex]);
          cdb.collections[collIndex].data.push(currObject);
        }
        workarray[lineIndex++] = null;
      }

      return cdb;
    };

    /**
     * Collection level utility function to deserializes a destructured collection.
     *
     * @param {string|array} destructuredSource - destructured representation of collection to inflate
     * @param {object=} options - used to describe format of destructuredSource input
     * @param {int=} [options.delimited=false] - whether source is delimited string or an array
     * @param {string=} options.delimiter - if delimited, this is delimiter to use (if other than default)
     *
     * @returns {array} an array of documents to attach to collection.data.
     * @memberof Loki
     */
    Loki.prototype.deserializeCollection = function(destructuredSource, options) {
      var workarray=[];
      var idx, len;

      options = options || {};

      if (!options.hasOwnProperty("partitioned")) {
        options.partitioned = false;
      }

      if (!options.hasOwnProperty("delimited")) {
        options.delimited = true;
      }

      if (!options.hasOwnProperty("delimiter")) {
        options.delimiter = this.options.destructureDelimiter;
      }

      if (options.delimited) {
        workarray = destructuredSource.split(options.delimiter);
        workarray.pop();
      }
      else {
        workarray = destructuredSource;
      }

      len = workarray.length;
      for (idx=0; idx < len; idx++) {
        workarray[idx] = JSON.parse(workarray[idx]);
      }

      return workarray;
    };

    /**
     * Inflates a loki database from a serialized JSON string
     *
     * @param {string} serializedDb - a serialized loki database string
     * @param {object=} options - apply or override collection level settings
     * @param {bool} options.retainDirtyFlags - whether collection dirty flags will be preserved
     * @memberof Loki
     */
    Loki.prototype.loadJSON = function (serializedDb, options) {
      var dbObject;
      if (serializedDb.length === 0) {
        dbObject = {};
      } else {
        switch (this.options.serializationMethod) {
          case "normal":
          case "pretty": dbObject = JSON.parse(serializedDb); break;
          case "destructured": dbObject = this.deserializeDestructured(serializedDb); break;
          default:  dbObject = JSON.parse(serializedDb); break;
        }
      }

      this.loadJSONObject(dbObject, options);
    };

    /**
     * Inflates a loki database from a JS object
     *
     * @param {object} dbObject - a serialized loki database string
     * @param {object=} options - apply or override collection level settings
     * @param {bool} options.retainDirtyFlags - whether collection dirty flags will be preserved
     * @memberof Loki
     */
    Loki.prototype.loadJSONObject = function (dbObject, options) {
      var i = 0,
        len = dbObject.collections ? dbObject.collections.length : 0,
        coll,
        copyColl,
        clen,
        j,
        loader,
        collObj;

      this.name = dbObject.name;
      if (dbObject.hasOwnProperty('throttledSaves') && options && !options.hasOwnProperty('throttledSaves')) {
        this.throttledSaves = dbObject.throttledSaves;
      }

      this.collections = [];

      function makeLoader(coll) {
        var collOptions = options[coll.name];
        var inflater;

        if(collOptions.proto) {
          inflater = collOptions.inflate || Utils.copyProperties;

          return function(data) {
            var collObj = new(collOptions.proto)();
            inflater(data, collObj);
            return collObj;
          };
        }

        return collOptions.inflate;
      }

      for (i; i < len; i += 1) {
        coll = dbObject.collections[i];

        copyColl = this.addCollection(coll.name, { disableChangesApi: coll.disableChangesApi, disableDeltaChangesApi: coll.disableDeltaChangesApi, disableMeta: coll.disableMeta });

        copyColl.adaptiveBinaryIndices = coll.hasOwnProperty('adaptiveBinaryIndices')?(coll.adaptiveBinaryIndices === true): false;
        copyColl.transactional = coll.transactional;
        copyColl.asyncListeners = coll.asyncListeners;
        copyColl.cloneObjects = coll.cloneObjects;
        copyColl.cloneMethod = coll.cloneMethod || "parse-stringify";
        copyColl.autoupdate = coll.autoupdate;
        copyColl.changes = coll.changes;

        if (options && options.retainDirtyFlags === true) {
          copyColl.dirty = coll.dirty;
        }
        else {
          copyColl.dirty = false;
        }
        clen = coll.data.length;
        j = 0;
        if (options && options.hasOwnProperty(coll.name)) {
          loader = makeLoader(coll);

          for (j; j < clen; j++) {
            collObj = loader(coll.data[j]);
            copyColl.data[j] = collObj;
            copyColl.addAutoUpdateObserver(collObj);
          }
        } else {

          for (j; j < clen; j++) {
            copyColl.data[j] = coll.data[j];
            copyColl.addAutoUpdateObserver(copyColl.data[j]);
          }
        }

        copyColl.maxId = (typeof coll.maxId === 'undefined') ? 0 : coll.maxId;
        copyColl.idIndex = coll.idIndex;
        if (typeof (coll.binaryIndices) !== 'undefined') {
          copyColl.binaryIndices = coll.binaryIndices;
        }
        if (typeof coll.transforms !== 'undefined') {
          copyColl.transforms = coll.transforms;
        }

        copyColl.ensureId();
        copyColl.uniqueNames = [];
        if (coll.hasOwnProperty("uniqueNames")) {
          copyColl.uniqueNames = coll.uniqueNames;
          for (j = 0; j < copyColl.uniqueNames.length; j++) {
            copyColl.ensureUniqueIndex(copyColl.uniqueNames[j]);
          }
        }
        if (typeof (coll.DynamicViews) === 'undefined') continue;
        for (var idx = 0; idx < coll.DynamicViews.length; idx++) {
          var colldv = coll.DynamicViews[idx];

          var dv = copyColl.addDynamicView(colldv.name, colldv.options);
          dv.resultdata = colldv.resultdata;
          dv.resultsdirty = colldv.resultsdirty;
          dv.filterPipeline = colldv.filterPipeline;

          dv.sortCriteria = colldv.sortCriteria;
          dv.sortFunction = null;

          dv.sortDirty = colldv.sortDirty;
          dv.resultset.filteredrows = colldv.resultset.filteredrows;
          dv.resultset.filterInitialized = colldv.resultset.filterInitialized;

          dv.rematerialize({
            removeWhereFilters: true
          });
        }
        if (dbObject.databaseVersion < 1.5) {
            copyColl.ensureAllIndexes(true);
            copyColl.dirty = true;
        }
      }
    };

    /**
     * Emits the close event. In autosave scenarios, if the database is dirty, this will save and disable timer.
     * Does not actually destroy the db.
     *
     * @param {function=} callback - (Optional) if supplied will be registered with close event before emitting.
     * @memberof Loki
     */
    Loki.prototype.close = function (callback) {
      if (this.autosave) {
        this.autosaveDisable();
        if (this.autosaveDirty()) {
          this.saveDatabase(callback);
          callback = undefined;
        }
      }

      if (callback) {
        this.on('close', callback);
      }
      this.emit('close');
    };

    /**-------------------------+
    | Changes API               |
    +--------------------------*/

    /**
     * The Changes API enables the tracking the changes occurred in the collections since the beginning of the session,
     * so it's possible to create a differential dataset for synchronization purposes (possibly to a remote db)
     */

    /**
     * (Changes API) : takes all the changes stored in each
     * collection and creates a single array for the entire database. If an array of names
     * of collections is passed then only the included collections will be tracked.
     *
     * @param {array=} optional array of collection names. No arg means all collections are processed.
     * @returns {array} array of changes
     * @see private method createChange() in Collection
     * @memberof Loki
     */
    Loki.prototype.generateChangesNotification = function (arrayOfCollectionNames) {
      function getCollName(coll) {
        return coll.name;
      }
      var changes = [],
        selectedCollections = arrayOfCollectionNames || this.collections.map(getCollName);

      this.collections.forEach(function (coll) {
        if (selectedCollections.indexOf(getCollName(coll)) !== -1) {
          changes = changes.concat(coll.getChanges());
        }
      });
      return changes;
    };

    /**
     * (Changes API) - stringify changes for network transmission
     * @returns {string} string representation of the changes
     * @memberof Loki
     */
    Loki.prototype.serializeChanges = function (collectionNamesArray) {
      return JSON.stringify(this.generateChangesNotification(collectionNamesArray));
    };

    /**
     * (Changes API) : clears all the changes in all collections.
     * @memberof Loki
     */
    Loki.prototype.clearChanges = function () {
      this.collections.forEach(function (coll) {
        if (coll.flushChanges) {
          coll.flushChanges();
        }
      });
    };

    /*------------------+
    | PERSISTENCE       |
    -------------------*/

    /** there are two build in persistence adapters for internal use
     * fs             for use in Nodejs type environments
     * localStorage   for use in browser environment
     * defined as helper classes here so its easy and clean to use
     */

    /**
     * In in-memory persistence adapter for an in-memory database.
     * This simple 'key/value' adapter is intended for unit testing and diagnostics.
     *
     * @param {object=} options - memory adapter options
     * @param {boolean} [options.asyncResponses=false] - whether callbacks are invoked asynchronously
     * @param {int} [options.asyncTimeout=50] - timeout in ms to queue callbacks
     * @constructor LokiMemoryAdapter
     */
    function LokiMemoryAdapter(options) {
      this.hashStore = {};
      this.options = options || {};

      if (!this.options.hasOwnProperty('asyncResponses')) {
        this.options.asyncResponses = false;
      }

      if (!this.options.hasOwnProperty('asyncTimeout')) {
        this.options.asyncTimeout = 50; // 50 ms default
      }
    }

    /**
     * Loads a serialized database from its in-memory store.
     * (Loki persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {function} callback - adapter callback to return load result to caller
     * @memberof LokiMemoryAdapter
     */
    LokiMemoryAdapter.prototype.loadDatabase = function (dbname, callback) {
      var self=this;

      if (this.options.asyncResponses) {
        setTimeout(function() {
          if (self.hashStore.hasOwnProperty(dbname)) {
            callback(self.hashStore[dbname].value);
          }
          else {
            callback (null);
          }
        }, this.options.asyncTimeout);
      }
      else {
        if (this.hashStore.hasOwnProperty(dbname)) {
          callback(this.hashStore[dbname].value);
        }
        else {
          callback (null);
        }
      }
    };

    /**
     * Saves a serialized database to its in-memory store.
     * (Loki persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {function} callback - adapter callback to return load result to caller
     * @memberof LokiMemoryAdapter
     */
    LokiMemoryAdapter.prototype.saveDatabase = function (dbname, dbstring, callback) {
      var self=this;
      var saveCount;

      if (this.options.asyncResponses) {
        setTimeout(function() {
          saveCount = (self.hashStore.hasOwnProperty(dbname)?self.hashStore[dbname].savecount:0);

          self.hashStore[dbname] = {
            savecount: saveCount+1,
            lastsave: new Date(),
            value: dbstring
          };

          callback();
        }, this.options.asyncTimeout);
      }
      else {
        saveCount = (this.hashStore.hasOwnProperty(dbname)?this.hashStore[dbname].savecount:0);

        this.hashStore[dbname] = {
          savecount: saveCount+1,
          lastsave: new Date(),
          value: dbstring
        };

        callback();
      }
    };

    /**
     * Deletes a database from its in-memory store.
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {function} callback - function to call when done
     * @memberof LokiMemoryAdapter
     */
    LokiMemoryAdapter.prototype.deleteDatabase = function(dbname, callback) {
      if (this.hashStore.hasOwnProperty(dbname)) {
        delete this.hashStore[dbname];
      }

      if (typeof callback === "function") {
        callback();
      }
    };

    /**
     * An adapter for adapters.  Converts a non reference mode adapter into a reference mode adapter
     * which can perform destructuring and partioning.  Each collection will be stored in its own key/save and
     * only dirty collections will be saved.  If you  turn on paging with default page size of 25megs and save
     * a 75 meg collection it should use up roughly 3 save slots (key/value pairs sent to inner adapter).
     * A dirty collection that spans three pages will save all three pages again
     * Paging mode was added mainly because Chrome has issues saving 'too large' of a string within a
     * single indexeddb row.  If a single document update causes the collection to be flagged as dirty, all
     * of that collection's pages will be written on next save.
     *
     * @param {object} adapter - reference to a 'non-reference' mode loki adapter instance.
     * @param {object=} options - configuration options for partitioning and paging
     * @param {bool} options.paging - (default: false) set to true to enable paging collection data.
     * @param {int} options.pageSize - (default : 25MB) you can use this to limit size of strings passed to inner adapter.
     * @param {string} options.delimiter - allows you to override the default delimeter
     * @constructor LokiPartitioningAdapter
     */
    function LokiPartitioningAdapter(adapter, options) {
      this.mode = "reference";
      this.adapter = null;
      this.options = options || {};
      this.dbref = null;
      this.dbname = "";
      this.pageIterator = {};
      if (adapter) {
        if (adapter.mode === "reference") {
          throw new Error("LokiPartitioningAdapter cannot be instantiated with a reference mode adapter");
        }
        else {
          this.adapter = adapter;
        }
      }
      else {
        throw new Error("LokiPartitioningAdapter requires a (non-reference mode) adapter on construction");
      }
      if (!this.options.hasOwnProperty("paging")) {
        this.options.paging = false;
      }
      if (!this.options.hasOwnProperty("pageSize")) {
        this.options.pageSize = 25*1024*1024;
      }

      if (!this.options.hasOwnProperty("delimiter")) {
        this.options.delimiter = '$<\n';
      }
    }

    /**
     * Loads a database which was partitioned into several key/value saves.
     * (Loki persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {function} callback - adapter callback to return load result to caller
     * @memberof LokiPartitioningAdapter
     */
    LokiPartitioningAdapter.prototype.loadDatabase = function (dbname, callback) {
      var self=this;
      this.dbname = dbname;
      this.dbref = new Loki(dbname);
      this.adapter.loadDatabase(dbname, function(result) {
        if (!result) {
          callback(result);
          return;
        }

        if (typeof result !== "string") {
          callback(new Error("LokiPartitioningAdapter received an unexpected response from inner adapter loadDatabase()"));
        }
        var db = JSON.parse(result);
        self.dbref.loadJSONObject(db);
        db = null;

        var clen = self.dbref.collections.length;

        if (self.dbref.collections.length === 0) {
          callback(self.dbref);
          return;
        }

        self.pageIterator = {
          collection: 0,
          pageIndex: 0
        };

        self.loadNextPartition(0, function() {
          callback(self.dbref);
        });
      });
    };

    /**
     * Used to sequentially load each collection partition, one at a time.
     *
     * @param {int} partition - ordinal collection position to load next
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.loadNextPartition = function(partition, callback) {
      var keyname = this.dbname + "." + partition;
      var self=this;

      if (this.options.paging === true) {
        this.pageIterator.pageIndex = 0;
        this.loadNextPage(callback);
        return;
      }

      this.adapter.loadDatabase(keyname, function(result) {
        var data = self.dbref.deserializeCollection(result, { delimited: true, collectionIndex: partition });
        self.dbref.collections[partition].data = data;

        if (++partition < self.dbref.collections.length) {
          self.loadNextPartition(partition, callback);
        }
        else {
          callback();
        }
      });
    };

    /**
     * Used to sequentially load the next page of collection partition, one at a time.
     *
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.loadNextPage = function(callback) {
      var keyname = this.dbname + "." + this.pageIterator.collection + "." + this.pageIterator.pageIndex;
      var self=this;
      this.adapter.loadDatabase(keyname, function(result) {
        var data = result.split(self.options.delimiter);
        result = ""; // free up memory now that we have split it into array
        var dlen = data.length;
        var idx;
        var isLastPage = (data[dlen-1] === "");
        if (isLastPage) {
          data.pop();
          dlen = data.length;
          if (data[dlen-1] === "" && dlen === 1) {
            data.pop();
            dlen = data.length;
          }
        }
        for(idx=0; idx < dlen; idx++) {
          self.dbref.collections[self.pageIterator.collection].data.push(JSON.parse(data[idx]));
          data[idx] = null;
        }
        data = [];
        if (isLastPage) {
          if (++self.pageIterator.collection < self.dbref.collections.length) {
            self.loadNextPartition(self.pageIterator.collection, callback);
          }
          else {
            callback();
          }
        }
        else {
          self.pageIterator.pageIndex++;
          self.loadNextPage(callback);
        }
      });
    };

    /**
     * Saves a database by partioning into separate key/value saves.
     * (Loki 'reference mode' persistence adapter interface function)
     *
     * @param {string} dbname - name of the database (filename/keyname)
     * @param {object} dbref - reference to database which we will partition and save.
     * @param {function} callback - adapter callback to return load result to caller
     *
     * @memberof LokiPartitioningAdapter
     */
    LokiPartitioningAdapter.prototype.exportDatabase = function(dbname, dbref, callback) {
      var self=this;
      var idx, clen = dbref.collections.length;

      this.dbref = dbref;
      this.dbname = dbname;
      this.dirtyPartitions = [-1];
      for(idx=0; idx<clen; idx++) {
        if (dbref.collections[idx].dirty) {
          this.dirtyPartitions.push(idx);
        }
      }

      this.saveNextPartition(function(err) {
        callback(err);
      });
    };

    /**
     * Helper method used internally to save each dirty collection, one at a time.
     *
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.saveNextPartition = function(callback) {
      var self=this;
      var partition = this.dirtyPartitions.shift();
      var keyname = this.dbname + ((partition===-1)?"":("." + partition));
      if (this.options.paging && partition !== -1) {
        this.pageIterator = {
          collection: partition,
          docIndex: 0,
          pageIndex: 0
        };
        this.saveNextPage(function(err) {
          if (self.dirtyPartitions.length === 0) {
            callback(err);
          }
          else {
            self.saveNextPartition(callback);
          }
        });
        return;
      }
      var result = this.dbref.serializeDestructured({
        partitioned : true,
        delimited: true,
        partition: partition
      });

      this.adapter.saveDatabase(keyname, result, function(err) {
        if (err) {
          callback(err);
          return;
        }

        if (self.dirtyPartitions.length === 0) {
          callback(null);
        }
        else {
          self.saveNextPartition(callback);
        }
      });
    };

    /**
     * Helper method used internally to generate and save the next page of the current (dirty) partition.
     *
     * @param {function} callback - adapter callback to return load result to caller
     */
    LokiPartitioningAdapter.prototype.saveNextPage = function(callback) {
      var self=this;
      var coll = this.dbref.collections[this.pageIterator.collection];
      var keyname = this.dbname + "." + this.pageIterator.collection + "." + this.pageIterator.pageIndex;
      var pageLen=0,
        cdlen = coll.data.length,
        delimlen = this.options.delimiter.length;
      var serializedObject = "",
        pageBuilder = "";
      var doneWithPartition=false,
        doneWithPage=false;

      var pageSaveCallback = function(err) {
        pageBuilder = "";

        if (err) {
          callback(err);
        }
        if (doneWithPartition) {
          callback(null);
        }
        else {
          self.pageIterator.pageIndex++;
          self.saveNextPage(callback);
        }
      };

      if (coll.data.length === 0) {
        doneWithPartition = true;
      }

      while (true) {
        if (!doneWithPartition) {
          serializedObject = JSON.stringify(coll.data[this.pageIterator.docIndex]);
          pageBuilder += serializedObject;
          pageLen += serializedObject.length;
          if (++this.pageIterator.docIndex >= cdlen) doneWithPartition = true;
        }
        if (pageLen >= this.options.pageSize) doneWithPage = true;
        if (!doneWithPage || doneWithPartition) {
          pageBuilder += this.options.delimiter;
          pageLen += delimlen;
        }
        if (doneWithPartition || doneWithPage) {
          this.adapter.saveDatabase(keyname, pageBuilder, pageSaveCallback);
          return;
        }
      }
    };

    /**
     * A loki persistence adapter which persists using node fs module
     * @constructor LokiFsAdapter
     */
    function LokiFsAdapter() {
      try {
        this.fs = __webpack_require__(11);
      }catch(e) {
        this.fs = null;
      }
    }

    /**
     * loadDatabase() - Load data from file, will throw an error if the file does not exist
     * @param {string} dbname - the filename of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiFsAdapter
     */
    LokiFsAdapter.prototype.loadDatabase = function loadDatabase(dbname, callback) {
      var self = this;

      this.fs.stat(dbname, function (err, stats) {
        if (!err && stats.isFile()) {
          self.fs.readFile(dbname, {
            encoding: 'utf8'
          }, function readFileCallback(err, data) {
            if (err) {
              callback(new Error(err));
            } else {
              callback(data);
            }
          });
        }
        else {
          callback(null);
        }
      });
    };

    /**
     * saveDatabase() - save data to file, will throw an error if the file can't be saved
     * might want to expand this to avoid dataloss on partial save
     * @param {string} dbname - the filename of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiFsAdapter
     */
    LokiFsAdapter.prototype.saveDatabase = function saveDatabase(dbname, dbstring, callback) {
      var self = this;
      var tmpdbname = dbname + '~';
      this.fs.writeFile(tmpdbname, dbstring, function writeFileCallback(err) {
        if (err) {
          callback(new Error(err));
        } else {
          self.fs.rename(tmpdbname,dbname,callback);
        }
      });
    };

    /**
     * deleteDatabase() - delete the database file, will throw an error if the
     * file can't be deleted
     * @param {string} dbname - the filename of the database to delete
     * @param {function} callback - the callback to handle the result
     * @memberof LokiFsAdapter
     */
    LokiFsAdapter.prototype.deleteDatabase = function deleteDatabase(dbname, callback) {
      this.fs.unlink(dbname, function deleteDatabaseCallback(err) {
        if (err) {
          callback(new Error(err));
        } else {
          callback();
        }
      });
    };


    /**
     * A loki persistence adapter which persists to web browser's local storage object
     * @constructor LokiLocalStorageAdapter
     */
    function LokiLocalStorageAdapter() {}

    /**
     * loadDatabase() - Load data from localstorage
     * @param {string} dbname - the name of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiLocalStorageAdapter
     */
    LokiLocalStorageAdapter.prototype.loadDatabase = function loadDatabase(dbname, callback) {
      if (localStorageAvailable()) {
        callback(localStorage.getItem(dbname));
      } else {
        callback(new Error('localStorage is not available'));
      }
    };

    /**
     * saveDatabase() - save data to localstorage, will throw an error if the file can't be saved
     * might want to expand this to avoid dataloss on partial save
     * @param {string} dbname - the filename of the database to load
     * @param {function} callback - the callback to handle the result
     * @memberof LokiLocalStorageAdapter
     */
    LokiLocalStorageAdapter.prototype.saveDatabase = function saveDatabase(dbname, dbstring, callback) {
      if (localStorageAvailable()) {
        localStorage.setItem(dbname, dbstring);
        callback(null);
      } else {
        callback(new Error('localStorage is not available'));
      }
    };

    /**
     * deleteDatabase() - delete the database from localstorage, will throw an error if it
     * can't be deleted
     * @param {string} dbname - the filename of the database to delete
     * @param {function} callback - the callback to handle the result
     * @memberof LokiLocalStorageAdapter
     */
    LokiLocalStorageAdapter.prototype.deleteDatabase = function deleteDatabase(dbname, callback) {
      if (localStorageAvailable()) {
        localStorage.removeItem(dbname);
        callback(null);
      } else {
        callback(new Error('localStorage is not available'));
      }
    };

    /**
     * Wait for throttledSaves to complete and invoke your callback when drained or duration is met.
     *
     * @param {function} callback - callback to fire when save queue is drained, it is passed a sucess parameter value
     * @param {object=} options - configuration options
     * @param {boolean} options.recursiveWait - (default: true) if after queue is drained, another save was kicked off, wait for it
     * @param {bool} options.recursiveWaitLimit - (default: false) limit our recursive waiting to a duration
     * @param {int} options.recursiveWaitLimitDelay - (default: 2000) cutoff in ms to stop recursively re-draining
     * @memberof Loki
     */
    Loki.prototype.throttledSaveDrain = function(callback, options) {
      var self = this;
      var now = (new Date()).getTime();

      if (!this.throttledSaves) {
        callback(true);
      }

      options = options || {};
      if (!options.hasOwnProperty('recursiveWait')) {
        options.recursiveWait = true;
      }
      if (!options.hasOwnProperty('recursiveWaitLimit')) {
        options.recursiveWaitLimit = false;
      }
      if (!options.hasOwnProperty('recursiveWaitLimitDuration')) {
        options.recursiveWaitLimitDuration = 2000;
      }
      if (!options.hasOwnProperty('started')) {
        options.started = (new Date()).getTime();
      }
      if (this.throttledSaves && this.throttledSavePending) {
        if (options.recursiveWait) {
          this.throttledCallbacks.push(function() {
            if (self.throttledSavePending) {
              if (options.recursiveWaitLimit && (now - options.started > options.recursiveWaitLimitDuration)) {
                callback(false);
                return;
              }
              self.throttledSaveDrain(callback, options);
              return;
            }
            else {
              callback(true);
              return;
            }
          });
        }
        else {
          this.throttledCallbacks.push(callback);
          return;
        }
      }
      else {
        callback(true);
      }
    };

    /**
     * Internal load logic, decoupled from throttling/contention logic
     *
     * @param {object} options - not currently used (remove or allow overrides?)
     * @param {function=} callback - (Optional) user supplied async callback / error handler
     */
    Loki.prototype.loadDatabaseInternal = function (options, callback) {
      var cFun = callback || function (err, data) {
          if (err) {
            throw err;
          }
        },
        self = this;
      if (this.persistenceAdapter !== null) {

        this.persistenceAdapter.loadDatabase(this.filename, function loadDatabaseCallback(dbString) {
          if (typeof (dbString) === 'string') {
            var parseSuccess = false;
            try {
              self.loadJSON(dbString, options || {});
              parseSuccess = true;
            } catch (err) {
              cFun(err);
            }
            if (parseSuccess) {
              cFun(null);
              self.emit('loaded', 'database ' + self.filename + ' loaded');
            }
          } else {
            if (!dbString) {
              cFun(null);
              self.emit('loaded', 'empty database ' + self.filename + ' loaded');
              return;
            }
            if (dbString instanceof Error) {
                cFun(dbString);
                return;
            }
            if (typeof (dbString) === "object") {
              self.loadJSONObject(dbString, options || {});
              cFun(null); // return null on success
              self.emit('loaded', 'database ' + self.filename + ' loaded');
              return;
            }

            cFun("unexpected adapter response : " + dbString);
          }
        });

      } else {
        cFun(new Error('persistenceAdapter not configured'));
      }
    };

    /**
     * Handles manually loading from file system, local storage, or adapter (such as indexeddb)
     *    This method utilizes loki configuration options (if provided) to determine which
     *    persistence method to use, or environment detection (if configuration was not provided).
     *    To avoid contention with any throttledSaves, we will drain the save queue first.
     *
     * If you are configured with autosave, you do not need to call this method yourself.
     *
     * @param {object} options - if throttling saves and loads, this controls how we drain save queue before loading
     * @param {boolean} options.recursiveWait - (default: true) wait recursively until no saves are queued
     * @param {bool} options.recursiveWaitLimit - (default: false) limit our recursive waiting to a duration
     * @param {int} options.recursiveWaitLimitDelay - (default: 2000) cutoff in ms to stop recursively re-draining
     * @param {function=} callback - (Optional) user supplied async callback / error handler
     * @memberof Loki
     * @example
     * db.loadDatabase({}, function(err) {
     *   if (err) {
     *     console.log("error : " + err);
     *   }
     *   else {
     *     console.log("database loaded.");
     *   }
     * });
     */
    Loki.prototype.loadDatabase = function (options, callback) {
      var self=this;
      if (!this.throttledSaves) {
        this.loadDatabaseInternal(options, callback);
        return;
      }
      this.throttledSaveDrain(function(success) {
        if (success) {
          self.throttledSavePending = true;

          self.loadDatabaseInternal(options, function(err) {
            if (self.throttledCallbacks.length === 0) {
              self.throttledSavePending = false;
            }
            else {
              self.saveDatabase();
            }

            if (typeof callback === 'function') {
              callback(err);
            }
          });
          return;
        }
        else {
          if (typeof callback === 'function') {
            callback(new Error("Unable to pause save throttling long enough to read database"));
          }
        }
      }, options);
    };

    /**
     * Internal save logic, decoupled from save throttling logic
     */
    Loki.prototype.saveDatabaseInternal = function (callback) {
      var cFun = callback || function (err) {
          if (err) {
            throw err;
          }
          return;
        },
        self = this;
      if (this.persistenceAdapter !== null) {
        if (this.persistenceAdapter.mode === "reference" && typeof this.persistenceAdapter.exportDatabase === "function") {
          this.persistenceAdapter.exportDatabase(this.filename, this.copy({removeNonSerializable:true}), function exportDatabaseCallback(err) {
            self.autosaveClearFlags();
            cFun(err);
          });
        }
        else {
          self.autosaveClearFlags();
          this.persistenceAdapter.saveDatabase(this.filename, self.serialize(), function saveDatabasecallback(err) {
            cFun(err);
          });
        }
      } else {
        cFun(new Error('persistenceAdapter not configured'));
      }
    };

    /**
     * Handles manually saving to file system, local storage, or adapter (such as indexeddb)
     *    This method utilizes loki configuration options (if provided) to determine which
     *    persistence method to use, or environment detection (if configuration was not provided).
     *
     * If you are configured with autosave, you do not need to call this method yourself.
     *
     * @param {function=} callback - (Optional) user supplied async callback / error handler
     * @memberof Loki
     * @example
     * db.saveDatabase(function(err) {
     *   if (err) {
     *     console.log("error : " + err);
     *   }
     *   else {
     *     console.log("database saved.");
     *   }
     * });
     */
    Loki.prototype.saveDatabase = function (callback) {
      if (!this.throttledSaves) {
        this.saveDatabaseInternal(callback);
        return;
      }

      if (this.throttledSavePending) {
        this.throttledCallbacks.push(callback);
        return;
      }

      var localCallbacks = this.throttledCallbacks;
      this.throttledCallbacks = [];
      localCallbacks.unshift(callback);
      this.throttledSavePending = true;

      var self = this;
      this.saveDatabaseInternal(function(err) {
        self.throttledSavePending = false;
        localCallbacks.forEach(function(pcb) {
          if (typeof pcb === 'function') {
            setTimeout(function() {
              pcb(err);
            }, 1);
          }
        });
        if (self.throttledCallbacks.length > 0) {
          self.saveDatabase();
        }
      });
    };
    Loki.prototype.save = Loki.prototype.saveDatabase;

    /**
     * Handles deleting a database from file system, local
     *    storage, or adapter (indexeddb)
     *    This method utilizes loki configuration options (if provided) to determine which
     *    persistence method to use, or environment detection (if configuration was not provided).
     *
     * @param {function=} callback - (Optional) user supplied async callback / error handler
     * @memberof Loki
     */
    Loki.prototype.deleteDatabase = function (options, callback) {
      var cFun = callback || function (err, data) {
        if (err) {
          throw err;
        }
      };
      if (typeof options === 'function' && !callback) {
        cFun = options;
      }
      if (this.persistenceAdapter !== null) {
        this.persistenceAdapter.deleteDatabase(this.filename, function deleteDatabaseCallback(err) {
          cFun(err);
        });
      } else {
        cFun(new Error('persistenceAdapter not configured'));
      }
    };

    /**
     * autosaveDirty - check whether any collections are 'dirty' meaning we need to save (entire) database
     *
     * @returns {boolean} - true if database has changed since last autosave, false if not.
     */
    Loki.prototype.autosaveDirty = function () {
      for (var idx = 0; idx < this.collections.length; idx++) {
        if (this.collections[idx].dirty) {
          return true;
        }
      }

      return false;
    };

    /**
     * autosaveClearFlags - resets dirty flags on all collections.
     *    Called from saveDatabase() after db is saved.
     *
     */
    Loki.prototype.autosaveClearFlags = function () {
      for (var idx = 0; idx < this.collections.length; idx++) {
        this.collections[idx].dirty = false;
      }
    };

    /**
     * autosaveEnable - begin a javascript interval to periodically save the database.
     *
     * @param {object} options - not currently used (remove or allow overrides?)
     * @param {function=} callback - (Optional) user supplied async callback
     */
    Loki.prototype.autosaveEnable = function (options, callback) {
      this.autosave = true;

      var delay = 5000,
        self = this;

      if (typeof (this.autosaveInterval) !== 'undefined' && this.autosaveInterval !== null) {
        delay = this.autosaveInterval;
      }

      this.autosaveHandle = setInterval(function autosaveHandleInterval() {

        if (self.autosaveDirty()) {
          self.saveDatabase(callback);
        }
      }, delay);
    };

    /**
     * autosaveDisable - stop the autosave interval timer.
     *
     */
    Loki.prototype.autosaveDisable = function () {
      if (typeof (this.autosaveHandle) !== 'undefined' && this.autosaveHandle !== null) {
        clearInterval(this.autosaveHandle);
        this.autosaveHandle = null;
      }
    };


    /**
     * Resultset class allowing chainable queries.  Intended to be instanced internally.
     *    Collection.find(), Collection.where(), and Collection.chain() instantiate this.
     *
     * @example
     *    mycollection.chain()
     *      .find({ 'doors' : 4 })
     *      .where(function(obj) { return obj.name === 'Toyota' })
     *      .data();
     *
     * @constructor Resultset
     * @param {Collection} collection - The collection which this Resultset will query against.
     */
    function Resultset(collection, options) {
      options = options || {};
      this.collection = collection;
      this.filteredrows = [];
      this.filterInitialized = false;

      return this;
    }

    /**
     * reset() - Reset the resultset to its initial state.
     *
     * @returns {Resultset} Reference to this resultset, for future chain operations.
     */
    Resultset.prototype.reset = function () {
      if (this.filteredrows.length > 0) {
        this.filteredrows = [];
      }
      this.filterInitialized = false;
      return this;
    };

    /**
     * toJSON() - Override of toJSON to avoid circular references
     *
     */
    Resultset.prototype.toJSON = function () {
      var copy = this.copy();
      copy.collection = null;
      return copy;
    };

    /**
     * Allows you to limit the number of documents passed to next chain operation.
     *    A resultset copy() is made to avoid altering original resultset.
     *
     * @param {int} qty - The number of documents to return.
     * @returns {Resultset} Returns a copy of the resultset, limited by qty, for subsequent chain ops.
     * @memberof Resultset
     * // find the two oldest users
     * var result = users.chain().simplesort("age", true).limit(2).data();
     */
    Resultset.prototype.limit = function (qty) {
      if (!this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var rscopy = new Resultset(this.collection);
      rscopy.filteredrows = this.filteredrows.slice(0, qty);
      rscopy.filterInitialized = true;
      return rscopy;
    };

    /**
     * Used for skipping 'pos' number of documents in the resultset.
     *
     * @param {int} pos - Number of documents to skip; all preceding documents are filtered out.
     * @returns {Resultset} Returns a copy of the resultset, containing docs starting at 'pos' for subsequent chain ops.
     * @memberof Resultset
     * // find everyone but the two oldest users
     * var result = users.chain().simplesort("age", true).offset(2).data();
     */
    Resultset.prototype.offset = function (pos) {
      if (!this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var rscopy = new Resultset(this.collection);
      rscopy.filteredrows = this.filteredrows.slice(pos);
      rscopy.filterInitialized = true;
      return rscopy;
    };

    /**
     * copy() - To support reuse of resultset in branched query situations.
     *
     * @returns {Resultset} Returns a copy of the resultset (set) but the underlying document references will be the same.
     * @memberof Resultset
     */
    Resultset.prototype.copy = function () {
      var result = new Resultset(this.collection);

      if (this.filteredrows.length > 0) {
        result.filteredrows = this.filteredrows.slice();
      }
      result.filterInitialized = this.filterInitialized;

      return result;
    };

    /**
     * Alias of copy()
     * @memberof Resultset
     */
    Resultset.prototype.branch = Resultset.prototype.copy;

    /**
     * transform() - executes a named collection transform or raw array of transform steps against the resultset.
     *
     * @param transform {(string|array)} - name of collection transform or raw transform array
     * @param parameters {object=} - (Optional) object property hash of parameters, if the transform requires them.
     * @returns {Resultset} either (this) resultset or a clone of of this resultset (depending on steps)
     * @memberof Resultset
     * @example
     * users.addTransform('CountryFilter', [
     *   {
     *     type: 'find',
     *     value: {
     *       'country': { $eq: '[%lktxp]Country' }
     *     }
     *   },
     *   {
     *     type: 'simplesort',
     *     property: 'age',
     *     options: { desc: false}
     *   }
     * ]);
     * var results = users.chain().transform("CountryFilter", { Country: 'fr' }).data();
     */
    Resultset.prototype.transform = function (transform, parameters) {
      var idx,
        step,
        rs = this;
      if (typeof transform === 'string') {
        if (this.collection.transforms.hasOwnProperty(transform)) {
          transform = this.collection.transforms[transform];
        }
      }
      if (typeof transform !== 'object' || !Array.isArray(transform)) {
        throw new Error("Invalid transform");
      }

      if (typeof parameters !== 'undefined') {
        transform = Utils.resolveTransformParams(transform, parameters);
      }

      for (idx = 0; idx < transform.length; idx++) {
        step = transform[idx];

        switch (step.type) {
        case "find":
          rs.find(step.value);
          break;
        case "where":
          rs.where(step.value);
          break;
        case "simplesort":
          rs.simplesort(step.property, step.desc || step.options);
          break;
        case "compoundsort":
          rs.compoundsort(step.value);
          break;
        case "sort":
          rs.sort(step.value);
          break;
        case "limit":
          rs = rs.limit(step.value);
          break; // limit makes copy so update reference
        case "offset":
          rs = rs.offset(step.value);
          break; // offset makes copy so update reference
        case "map":
          rs = rs.map(step.value, step.dataOptions);
          break;
        case "eqJoin":
          rs = rs.eqJoin(step.joinData, step.leftJoinKey, step.rightJoinKey, step.mapFun, step.dataOptions);
          break;
        case "mapReduce":
          rs = rs.mapReduce(step.mapFunction, step.reduceFunction);
          break;
        case "update":
          rs.update(step.value);
          break;
        case "remove":
          rs.remove();
          break;
        default:
          break;
        }
      }

      return rs;
    };

    /**
     * User supplied compare function is provided two documents to compare. (chainable)
     * @example
     *    rslt.sort(function(obj1, obj2) {
     *      if (obj1.name === obj2.name) return 0;
     *      if (obj1.name > obj2.name) return 1;
     *      if (obj1.name < obj2.name) return -1;
     *    });
     *
     * @param {function} comparefun - A javascript compare function used for sorting.
     * @returns {Resultset} Reference to this resultset, sorted, for future chain operations.
     * @memberof Resultset
     */
    Resultset.prototype.sort = function (comparefun) {
      if (!this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var wrappedComparer =
        (function (userComparer, data) {
          return function (a, b) {
            return userComparer(data[a], data[b]);
          };
        })(comparefun, this.collection.data);

      this.filteredrows.sort(wrappedComparer);

      return this;
    };

    /**
     * Simpler, loose evaluation for user to sort based on a property name. (chainable).
     *    Sorting based on the same lt/gt helper functions used for binary indices.
     *
     * @param {string} propname - name of property to sort by.
     * @param {object|bool=} options - boolean to specify if isdescending, or options object
     * @param {boolean} [options.desc=false] - whether to sort descending
     * @param {boolean} [options.disableIndexIntersect=false] - whether we should explicity not use array intersection.
     * @param {boolean} [options.forceIndexIntersect=false] - force array intersection (if binary index exists).
     * @param {boolean} [options.useJavascriptSorting=false] - whether results are sorted via basic javascript sort.
     * @returns {Resultset} Reference to this resultset, sorted, for future chain operations.
     * @memberof Resultset
     * @example
     * var results = users.chain().simplesort('age').data();
     */
    Resultset.prototype.simplesort = function (propname, options) {
      var eff, 
        targetEff = 10,
        dc = this.collection.data.length, 
        frl = this.filteredrows.length,
        hasBinaryIndex = this.collection.binaryIndices.hasOwnProperty(propname);

      if (typeof (options) === 'undefined' || options === false) {
        options = { desc: false };
      }
      if (options === true) {
        options = { desc: true };
      }
      if (frl === 0) {
        if (this.filterInitialized) {
          return this;
        }
        if (this.collection.binaryIndices.hasOwnProperty(propname)) {
          this.collection.ensureIndex(propname);
          this.filteredrows = this.collection.binaryIndices[propname].values.slice(0);

          if (options.desc) {
            this.filteredrows.reverse();
          }
          return this;
        }
        else {
          this.filteredrows = this.collection.prepareFullDocIndex();
        }
      }
      else {
        if (!options.disableIndexIntersect && hasBinaryIndex) {
          eff = dc/frl;
          if (options.useJavascriptSorting) {
            targetEff = 6;
          }
          if (eff <= targetEff || options.forceIndexIntersect) {
            var idx, fr=this.filteredrows;
            var io = {};
            for(idx=0; idx<frl; idx++) {
              io[fr[idx]] = true;
            }
            var pv = this.collection.binaryIndices[propname].values;
            this.filteredrows = pv.filter(function(n) { return io[n]; });

            if (options.desc) {
              this.filteredrows.reverse();
            }

            return this;
          }
        }
      }
      if (options.useJavascriptSorting) {
        return this.sort(function(obj1, obj2) {
          if (obj1[propname] === obj2[propname]) return 0;
          if (obj1[propname] > obj2[propname]) return 1;
          if (obj1[propname] < obj2[propname]) return -1;
        });
      }
      var wrappedComparer =
        (function (prop, desc, data) {
          var val1, val2, arr;
          return function (a, b) {
            if (~prop.indexOf('.')) {
              arr = prop.split('.');
              val1 = arr.reduce(function(obj, i) { return obj && obj[i] || undefined; }, data[a]);
              val2 = arr.reduce(function(obj, i) { return obj && obj[i] || undefined; }, data[b]);
            } else {
              val1 = data[a][prop];
              val2 = data[b][prop];
            }
            return sortHelper(val1, val2, desc);
          };
        })(propname, options.desc, this.collection.data);

      this.filteredrows.sort(wrappedComparer);

      return this;
    };

    /**
     * Allows sorting a resultset based on multiple columns.
     * @example
     * // to sort by age and then name (both ascending)
     * rs.compoundsort(['age', 'name']);
     * // to sort by age (ascending) and then by name (descending)
     * rs.compoundsort(['age', ['name', true]);
     *
     * @param {array} properties - array of property names or subarray of [propertyname, isdesc] used evaluate sort order
     * @returns {Resultset} Reference to this resultset, sorted, for future chain operations.
     * @memberof Resultset
     */
    Resultset.prototype.compoundsort = function (properties) {
      if (properties.length === 0) {
        throw new Error("Invalid call to compoundsort, need at least one property");
      }

      var prop;
      if (properties.length === 1) {
        prop = properties[0];
        if (Array.isArray(prop)) {
          return this.simplesort(prop[0], prop[1]);
        }
        return this.simplesort(prop, false);
      }
      for (var i = 0, len = properties.length; i < len; i += 1) {
        prop = properties[i];
        if (!Array.isArray(prop)) {
          properties[i] = [prop, false];
        }
      }
      if (!this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var wrappedComparer =
        (function (props, data) {
          return function (a, b) {
            return compoundeval(props, data[a], data[b]);
          };
        })(properties, this.collection.data);

      this.filteredrows.sort(wrappedComparer);

      return this;
    };

    /**
     * findOr() - oversee the operation of OR'ed query expressions.
     *    OR'ed expression evaluation runs each expression individually against the full collection,
     *    and finally does a set OR on each expression's results.
     *    Each evaluation can utilize a binary index to prevent multiple linear array scans.
     *
     * @param {array} expressionArray - array of expressions
     * @returns {Resultset} this resultset for further chain ops.
     */
    Resultset.prototype.findOr = function (expressionArray) {
      var fr = null,
        fri = 0,
        frlen = 0,
        docset = [],
        idxset = [],
        idx = 0,
        origCount = this.count();
      for (var ei = 0, elen = expressionArray.length; ei < elen; ei++) {
        fr = this.branch().find(expressionArray[ei]).filteredrows;
        frlen = fr.length;
        if (frlen === origCount) {
          return this;
        }
        for (fri = 0; fri < frlen; fri++) {
          idx = fr[fri];
          if (idxset[idx] === undefined) {
            idxset[idx] = true;
            docset.push(idx);
          }
        }
      }

      this.filteredrows = docset;
      this.filterInitialized = true;

      return this;
    };
    Resultset.prototype.$or = Resultset.prototype.findOr;

    /**
     * findAnd() - oversee the operation of AND'ed query expressions.
     *    AND'ed expression evaluation runs each expression progressively against the full collection,
     *    internally utilizing existing chained resultset functionality.
     *    Only the first filter can utilize a binary index.
     *
     * @param {array} expressionArray - array of expressions
     * @returns {Resultset} this resultset for further chain ops.
     */
    Resultset.prototype.findAnd = function (expressionArray) {
      for (var i = 0, len = expressionArray.length; i < len; i++) {
        if (this.count() === 0) {
          return this;
        }
        this.find(expressionArray[i]);
      }
      return this;
    };
    Resultset.prototype.$and = Resultset.prototype.findAnd;

    /**
     * Used for querying via a mongo-style query object.
     *
     * @param {object} query - A mongo-style query object used for filtering current results.
     * @param {boolean=} firstOnly - (Optional) Used by collection.findOne()
     * @returns {Resultset} this resultset for further chain ops.
     * @memberof Resultset
     * @example
     * var over30 = users.chain().find({ age: { $gte: 30 } }).data();
     */
    Resultset.prototype.find = function (query, firstOnly) {
      if (this.collection.data.length === 0) {
        this.filteredrows = [];
        this.filterInitialized = true;
        return this;
      }

      var queryObject = query || 'getAll',
        p,
        property,
        queryObjectOp,
        obj,
        operator,
        value,
        key,
        searchByIndex = false,
        result = [],
        filters = [],
        index = null;
      firstOnly = firstOnly || false;

      if (typeof queryObject === 'object') {
        for (p in queryObject) {
          obj = {};
          obj[p] = queryObject[p];
          filters.push(obj);

          if (hasOwnProperty.call(queryObject, p)) {
            property = p;
            queryObjectOp = queryObject[p];
          }
        }
        if (filters.length > 1) {
          return this.find({ '$and': filters }, firstOnly);
        }
      }
      if (!property || queryObject === 'getAll') {
        if (firstOnly) {
          this.filteredrows = (this.collection.data.length > 0)?[0]: [];
          this.filterInitialized = true;
        }

        return this;
      }
      if (property === '$and' || property === '$or') {
        this[property](queryObjectOp);
        if (firstOnly && this.filteredrows.length > 1) {
          this.filteredrows = this.filteredrows.slice(0, 1);
        }

        return this;
      }
      if (queryObjectOp === null || (typeof queryObjectOp !== 'object' || queryObjectOp instanceof Date)) {
        operator = '$eq';
        value = queryObjectOp;
      } else if (typeof queryObjectOp === 'object') {
        for (key in queryObjectOp) {
          if (hasOwnProperty.call(queryObjectOp, key)) {
            operator = key;
            value = queryObjectOp[key];
            break;
          }
        }
      } else {
        throw new Error('Do not know what you want to do.');
      }
      if (operator === '$regex') {
        if (Array.isArray(value)) {
          value = new RegExp(value[0], value[1]);
        } else if (!(value instanceof RegExp)) {
          value = new RegExp(value);
        }
      }
      var usingDotNotation = (property.indexOf('.') !== -1);
      var doIndexCheck = !usingDotNotation && !this.filterInitialized;

      if (doIndexCheck && this.collection.binaryIndices[property] && indexedOps[operator]) {
        if (this.collection.adaptiveBinaryIndices !== true) {
          this.collection.ensureIndex(property);
        }

        searchByIndex = true;
        index = this.collection.binaryIndices[property];
      }
      var fun = LokiOps[operator];
      var t = this.collection.data;
      var i = 0,
        len = 0;

      var filter, rowIdx = 0;
      if (this.filterInitialized) {
        filter = this.filteredrows;
        len = filter.length;
        if (usingDotNotation) {
          property = property.split('.');
          for(i=0; i<len; i++) {
            rowIdx = filter[i];
            if (dotSubScan(t[rowIdx], property, fun, value)) {
              result.push(rowIdx);
            }
          }
        } else {
          for(i=0; i<len; i++) {
            rowIdx = filter[i];
            if (fun(t[rowIdx][property], value)) {
              result.push(rowIdx);
            }
          }
        }
      }
      else {
        if (!searchByIndex) {
          len = t.length;

          if (usingDotNotation) {
            property = property.split('.');
            for(i=0; i<len; i++) {
              if (dotSubScan(t[i], property, fun, value)) {
                result.push(i);
                if (firstOnly) {
                  this.filteredrows = result;
                  this.filterInitialized = true;
                  return this;
                }
              }
            }
          } else {
            for(i=0; i<len; i++) {
              if (fun(t[i][property], value)) {
                result.push(i);
                if (firstOnly) {
                  this.filteredrows = result;
                  this.filterInitialized = true;
                  return this;
                }
              }
            }
          }
        } else {
          var segm = this.collection.calculateRange(operator, property, value);

          if (operator !== '$in') {
            for (i = segm[0]; i <= segm[1]; i++) {
              if (indexedOps[operator] !== true) {
                if (indexedOps[operator](t[index.values[i]][property], value)) {
                  result.push(index.values[i]);
                  if (firstOnly) {
                    this.filteredrows = result;
                    this.filterInitialized = true;
                    return this;
                  }
                }
              }
              else {
                  result.push(index.values[i]);
                  if (firstOnly) {
                    this.filteredrows = result;
                    this.filterInitialized = true;
                    return this;
                  }
              }
            }
          } else {
            for (i = 0, len = segm.length; i < len; i++) {
              result.push(index.values[segm[i]]);
              if (firstOnly) {
                this.filteredrows = result;
                this.filterInitialized = true;
                return this;
              }
            }
          }
        }

      }

      this.filteredrows = result;
      this.filterInitialized = true; // next time work against filteredrows[]
      return this;
    };


    /**
     * where() - Used for filtering via a javascript filter function.
     *
     * @param {function} fun - A javascript function used for filtering current results by.
     * @returns {Resultset} this resultset for further chain ops.
     * @memberof Resultset
     * @example
     * var over30 = users.chain().where(function(obj) { return obj.age >= 30; }.data();
     */
    Resultset.prototype.where = function (fun) {
      var viewFunction,
        result = [];

      if ('function' === typeof fun) {
        viewFunction = fun;
      } else {
        throw new TypeError('Argument is not a stored view or a function');
      }
      try {
        if (this.filterInitialized) {
          var j = this.filteredrows.length;

          while (j--) {
            if (viewFunction(this.collection.data[this.filteredrows[j]]) === true) {
              result.push(this.filteredrows[j]);
            }
          }

          this.filteredrows = result;

          return this;
        }
        else {
          var k = this.collection.data.length;

          while (k--) {
            if (viewFunction(this.collection.data[k]) === true) {
              result.push(k);
            }
          }

          this.filteredrows = result;
          this.filterInitialized = true;

          return this;
        }
      } catch (err) {
        throw err;
      }
    };

    /**
     * count() - returns the number of documents in the resultset.
     *
     * @returns {number} The number of documents in the resultset.
     * @memberof Resultset
     * @example
     * var over30Count = users.chain().find({ age: { $gte: 30 } }).count();
     */
    Resultset.prototype.count = function () {
      if (this.filterInitialized) {
        return this.filteredrows.length;
      }
      return this.collection.count();
    };

    /**
     * Terminates the chain and returns array of filtered documents
     *
     * @param {object=} options - allows specifying 'forceClones' and 'forceCloneMethod' options.
     * @param {boolean} options.forceClones - Allows forcing the return of cloned objects even when
     *        the collection is not configured for clone object.
     * @param {string} options.forceCloneMethod - Allows overriding the default or collection specified cloning method.
     *        Possible values include 'parse-stringify', 'jquery-extend-deep', 'shallow', 'shallow-assign'
     * @param {bool} options.removeMeta - Will force clones and strip $loki and meta properties from documents
     *
     * @returns {array} Array of documents in the resultset
     * @memberof Resultset
     * @example
     * var resutls = users.chain().find({ age: 34 }).data();
     */
    Resultset.prototype.data = function (options) {
      var result = [],
        data = this.collection.data,
        obj,
        len,
        i,
        method;

      options = options || {};
      if (options.removeMeta && !options.forceClones) {
        options.forceClones = true;
        options.forceCloneMethod = options.forceCloneMethod || 'shallow';
      }
      if (!this.collection.disableDeltaChangesApi) {
        options.forceClones = true;
        options.forceCloneMethod = 'parse-stringify';
      }
      if (!this.filterInitialized) {
        if (this.filteredrows.length === 0) {
          if (this.collection.cloneObjects || options.forceClones) {
            len = data.length;
            method = options.forceCloneMethod || this.collection.cloneMethod;

            for (i = 0; i < len; i++) {
              obj = clone(data[i], method);
              if (options.removeMeta) {
                delete obj.$loki;
                delete obj.meta;
              }
              result.push(obj);
            }
            return result;
          }
          else {
            return data.slice();
          }
        } else {
          this.filterInitialized = true;
        }
      }

      var fr = this.filteredrows;
      len = fr.length;

      if (this.collection.cloneObjects || options.forceClones) {
        method = options.forceCloneMethod || this.collection.cloneMethod;
        for (i = 0; i < len; i++) {
          obj = clone(data[fr[i]], method);
          if (options.removeMeta) {
            delete obj.$loki;
            delete obj.meta;
          }
          result.push(obj);
        }
      } else {
        for (i = 0; i < len; i++) {
          result.push(data[fr[i]]);
        }
      }
      return result;
    };

    /**
     * Used to run an update operation on all documents currently in the resultset.
     *
     * @param {function} updateFunction - User supplied updateFunction(obj) will be executed for each document object.
     * @returns {Resultset} this resultset for further chain ops.
     * @memberof Resultset
     * @example
     * users.chain().find({ country: 'de' }).update(function(user) {
     *   user.phoneFormat = "+49 AAAA BBBBBB";
     * });
     */
    Resultset.prototype.update = function (updateFunction) {

      if (typeof (updateFunction) !== "function") {
        throw new TypeError('Argument is not a function');
      }
      if (!this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      var obj, len = this.filteredrows.length,
        rcd = this.collection.data;
      for (var idx = 0; idx < len; idx++) {
        if (this.collection.cloneObjects || !this.collection.disableDeltaChangesApi) {
          obj = clone(rcd[this.filteredrows[idx]], this.collection.cloneMethod);
          updateFunction(obj);
          this.collection.update(obj);
        }
        else {
          updateFunction(rcd[this.filteredrows[idx]]);
          this.collection.update(rcd[this.filteredrows[idx]]);
        }
      }

      return this;
    };

    /**
     * Removes all document objects which are currently in resultset from collection (as well as resultset)
     *
     * @returns {Resultset} this (empty) resultset for further chain ops.
     * @memberof Resultset
     * @example
     * // remove users inactive since 1/1/2001
     * users.chain().find({ lastActive: { $lte: new Date("1/1/2001").getTime() } }).remove();
     */
    Resultset.prototype.remove = function () {
      if (!this.filterInitialized && this.filteredrows.length === 0) {
        this.filteredrows = this.collection.prepareFullDocIndex();
      }

      this.collection.removeBatchByPositions(this.filteredrows);

      this.filteredrows = [];

      return this;
    };

    /**
     * data transformation via user supplied functions
     *
     * @param {function} mapFunction - this function accepts a single document for you to transform and return
     * @param {function} reduceFunction - this function accepts many (array of map outputs) and returns single value
     * @returns {value} The output of your reduceFunction
     * @memberof Resultset
     * @example
     * var db = new loki("order.db");
     * var orders = db.addCollection("orders");
     * orders.insert([{ qty: 4, unitCost: 100.00 }, { qty: 10, unitCost: 999.99 }, { qty: 2, unitCost: 49.99 }]);
     *
     * function mapfun (obj) { return obj.qty*obj.unitCost };
     * function reducefun(array) {
     *   var grandTotal=0;
     *   array.forEach(function(orderTotal) { grandTotal += orderTotal; });
     *   return grandTotal;
     * }
     * var grandOrderTotal = orders.chain().mapReduce(mapfun, reducefun);
     * console.log(grandOrderTotal);
     */
    Resultset.prototype.mapReduce = function (mapFunction, reduceFunction) {
      try {
        return reduceFunction(this.data().map(mapFunction));
      } catch (err) {
        throw err;
      }
    };

    /**
     * eqJoin() - Left joining two sets of data. Join keys can be defined or calculated properties
     * eqJoin expects the right join key values to be unique.  Otherwise left data will be joined on the last joinData object with that key
     * @param {Array|Resultset|Collection} joinData - Data array to join to.
     * @param {(string|function)} leftJoinKey - Property name in this result set to join on or a function to produce a value to join on
     * @param {(string|function)} rightJoinKey - Property name in the joinData to join on or a function to produce a value to join on
     * @param {function=} mapFun - (Optional) A function that receives each matching pair and maps them into output objects - function(left,right){return joinedObject}
     * @param {object=} dataOptions - options to data() before input to your map function
     * @param {bool} dataOptions.removeMeta - allows removing meta before calling mapFun
     * @param {boolean} dataOptions.forceClones - forcing the return of cloned objects to your map object
     * @param {string} dataOptions.forceCloneMethod - Allows overriding the default or collection specified cloning method.
     * @returns {Resultset} A resultset with data in the format [{left: leftObj, right: rightObj}]
     * @memberof Resultset
     * @example
     * var db = new loki('sandbox.db');
     *
     * var products = db.addCollection('products');
     * var orders = db.addCollection('orders');
     *
     * products.insert({ productId: "100234", name: "flywheel energy storage", unitCost: 19999.99 });
     * products.insert({ productId: "140491", name: "300F super capacitor", unitCost: 129.99 });
     * products.insert({ productId: "271941", name: "fuel cell", unitCost: 3999.99 });
     * products.insert({ productId: "174592", name: "390V 3AH lithium bank", unitCost: 4999.99 });
     *
     * orders.insert({ orderDate : new Date("12/1/2017").getTime(), prodId: "174592", qty: 2, customerId: 2 });
     * orders.insert({ orderDate : new Date("4/15/2016").getTime(), prodId: "271941", qty: 1, customerId: 1 });
     * orders.insert({ orderDate : new Date("3/12/2017").getTime(), prodId: "140491", qty: 4, customerId: 4 });
     * orders.insert({ orderDate : new Date("7/31/2017").getTime(), prodId: "100234", qty: 7, customerId: 3 });
     * orders.insert({ orderDate : new Date("8/3/2016").getTime(), prodId: "174592", qty: 3, customerId: 5 });
     *
     * var mapfun = function(left, right) {
     *   return {
     *     orderId: left.$loki,
     *     orderDate: new Date(left.orderDate) + '',
     *     customerId: left.customerId,
     *     qty: left.qty,
     *     productId: left.prodId,
     *     prodName: right.name,
     *     prodCost: right.unitCost,
     *     orderTotal: +((right.unitCost * left.qty).toFixed(2))
     *   };
     * };
     *
     * // join orders with relevant product info via eqJoin
     * var orderSummary = orders.chain().eqJoin(products, "prodId", "productId", mapfun).data();
     * 
     * console.log(orderSummary);     
     */
    Resultset.prototype.eqJoin = function (joinData, leftJoinKey, rightJoinKey, mapFun, dataOptions) {

      var leftData = [],
        leftDataLength,
        rightData = [],
        rightDataLength,
        key,
        result = [],
        leftKeyisFunction = typeof leftJoinKey === 'function',
        rightKeyisFunction = typeof rightJoinKey === 'function',
        joinMap = {};
      leftData = this.data(dataOptions);
      leftDataLength = leftData.length;
      if (joinData instanceof Collection) {
        rightData = joinData.chain().data(dataOptions);
      } else if (joinData instanceof Resultset) {
        rightData = joinData.data(dataOptions);
      } else if (Array.isArray(joinData)) {
        rightData = joinData;
      } else {
        throw new TypeError('joinData needs to be an array or result set');
      }
      rightDataLength = rightData.length;

      for (var i = 0; i < rightDataLength; i++) {
        key = rightKeyisFunction ? rightJoinKey(rightData[i]) : rightData[i][rightJoinKey];
        joinMap[key] = rightData[i];
      }

      if (!mapFun) {
        mapFun = function (left, right) {
          return {
            left: left,
            right: right
          };
        };
      }
      for (var j = 0; j < leftDataLength; j++) {
        key = leftKeyisFunction ? leftJoinKey(leftData[j]) : leftData[j][leftJoinKey];
        result.push(mapFun(leftData[j], joinMap[key] || {}));
      }
      this.collection = new Collection('joinData');
      this.collection.insert(result);
      this.filteredrows = [];
      this.filterInitialized = false;

      return this;
    };

    /**
     * Applies a map function into a new collection for further chaining.
     * @param {function} mapFun - javascript map function
     * @param {object=} dataOptions - options to data() before input to your map function
     * @param {bool} dataOptions.removeMeta - allows removing meta before calling mapFun
     * @param {boolean} dataOptions.forceClones - forcing the return of cloned objects to your map object
     * @param {string} dataOptions.forceCloneMethod - Allows overriding the default or collection specified cloning method.
     * @memberof Resultset
     * @example
     * var orders.chain().find({ productId: 32 }).map(function(obj) {
     *   return {
     *     orderId: $loki,
     *     productId: productId,
     *     quantity: qty
     *   };
     * });
     */
    Resultset.prototype.map = function (mapFun, dataOptions) {
      var data = this.data(dataOptions).map(mapFun);
      this.collection = new Collection('mappedData');
      this.collection.insert(data);
      this.filteredrows = [];
      this.filterInitialized = false;

      return this;
    };

    /**
     * DynamicView class is a versatile 'live' view class which can have filters and sorts applied.
     *    Collection.addDynamicView(name) instantiates this DynamicView object and notifies it
     *    whenever documents are add/updated/removed so it can remain up-to-date. (chainable)
     *
     * @example
     * var mydv = mycollection.addDynamicView('test');  // default is non-persistent
     * mydv.applyFind({ 'doors' : 4 });
     * mydv.applyWhere(function(obj) { return obj.name === 'Toyota'; });
     * var results = mydv.data();
     *
     * @constructor DynamicView
     * @implements LokiEventEmitter
     * @param {Collection} collection - A reference to the collection to work against
     * @param {string} name - The name of this dynamic view
     * @param {object=} options - (Optional) Pass in object with 'persistent' and/or 'sortPriority' options.
     * @param {boolean} [options.persistent=false] - indicates if view is to main internal results array in 'resultdata'
     * @param {string} [options.sortPriority='passive'] - 'passive' (sorts performed on call to data) or 'active' (after updates)
     * @param {number} options.minRebuildInterval - minimum rebuild interval (need clarification to docs here)
     * @see {@link Collection#addDynamicView} to construct instances of DynamicView
     */
    function DynamicView(collection, name, options) {
      this.collection = collection;
      this.name = name;
      this.rebuildPending = false;
      this.options = options || {};

      if (!this.options.hasOwnProperty('persistent')) {
        this.options.persistent = false;
      }
      if (!this.options.hasOwnProperty('sortPriority')) {
        this.options.sortPriority = 'passive';
      }

      if (!this.options.hasOwnProperty('minRebuildInterval')) {
        this.options.minRebuildInterval = 1;
      }

      this.resultset = new Resultset(collection);
      this.resultdata = [];
      this.resultsdirty = false;

      this.cachedresultset = null;
      this.filterPipeline = [];
      this.sortFunction = null;
      this.sortCriteria = null;
      this.sortCriteriaSimple = null;
      this.sortDirty = false;

      this.events = {
        'rebuild': []
      };
    }

    DynamicView.prototype = new LokiEventEmitter();


    /**
     * rematerialize() - internally used immediately after deserialization (loading)
     *    This will clear out and reapply filterPipeline ops, recreating the view.
     *    Since where filters do not persist correctly, this method allows
     *    restoring the view to state where user can re-apply those where filters.
     *
     * @param {Object=} options - (Optional) allows specification of 'removeWhereFilters' option
     * @returns {DynamicView} This dynamic view for further chained ops.
     * @memberof DynamicView
     * @fires DynamicView.rebuild
     */
    DynamicView.prototype.rematerialize = function (options) {
      var fpl,
        fpi,
        idx;

      options = options || {};

      this.resultdata = [];
      this.resultsdirty = true;
      this.resultset = new Resultset(this.collection);

      if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
        this.sortDirty = true;
      }

      if (options.hasOwnProperty('removeWhereFilters')) {
        fpl = this.filterPipeline.length;
        fpi = fpl;
        while (fpi--) {
          if (this.filterPipeline[fpi].type === 'where') {
            if (fpi !== this.filterPipeline.length - 1) {
              this.filterPipeline[fpi] = this.filterPipeline[this.filterPipeline.length - 1];
            }

            this.filterPipeline.length--;
          }
        }
      }
      var ofp = this.filterPipeline;
      this.filterPipeline = [];
      fpl = ofp.length;
      for (idx = 0; idx < fpl; idx++) {
        this.applyFind(ofp[idx].val);
      }
      this.data();
      this.emit('rebuild', this);

      return this;
    };

    /**
     * branchResultset() - Makes a copy of the internal resultset for branched queries.
     *    Unlike this dynamic view, the branched resultset will not be 'live' updated,
     *    so your branched query should be immediately resolved and not held for future evaluation.
     *
     * @param {(string|array=)} transform - Optional name of collection transform, or an array of transform steps
     * @param {object=} parameters - optional parameters (if optional transform requires them)
     * @returns {Resultset} A copy of the internal resultset for branched queries.
     * @memberof DynamicView
     * @example
     * var db = new loki('test');
     * var coll = db.addCollection('mydocs');
     * var dv = coll.addDynamicView('myview');
     * var tx = [
     *   {
     *     type: 'offset',
     *     value: '[%lktxp]pageStart'
     *   },
     *   {
     *     type: 'limit',
     *     value: '[%lktxp]pageSize'
     *   }
     * ];
     * coll.addTransform('viewPaging', tx);
     * 
     * // add some records
     * 
     * var results = dv.branchResultset('viewPaging', { pageStart: 10, pageSize: 10 }).data();     
     */
    DynamicView.prototype.branchResultset = function (transform, parameters) {
      var rs = this.resultset.branch();

      if (typeof transform === 'undefined') {
        return rs;
      }

      return rs.transform(transform, parameters);
    };

    /**
     * toJSON() - Override of toJSON to avoid circular references
     *
     */
    DynamicView.prototype.toJSON = function () {
      var copy = new DynamicView(this.collection, this.name, this.options);

      copy.resultset = this.resultset;
      copy.resultdata = []; // let's not save data (copy) to minimize size
      copy.resultsdirty = true;
      copy.filterPipeline = this.filterPipeline;
      copy.sortFunction = this.sortFunction;
      copy.sortCriteria = this.sortCriteria;
      copy.sortCriteriaSimple = this.sortCriteriaSimple || null;
      copy.sortDirty = this.sortDirty;
      copy.collection = null;

      return copy;
    };

    /**
     * removeFilters() - Used to clear pipeline and reset dynamic view to initial state.
     *     Existing options should be retained.
     * @param {object=} options - configure removeFilter behavior
     * @param {boolean=} options.queueSortPhase - (default: false) if true we will async rebuild view (maybe set default to true in future?)
     * @memberof DynamicView
     */
    DynamicView.prototype.removeFilters = function (options) {
      options = options || {};

      this.rebuildPending = false;
      this.resultset.reset();
      this.resultdata = [];
      this.resultsdirty = true;

      this.cachedresultset = null;
      this.filterPipeline = [];
      this.sortFunction = null;
      this.sortCriteria = null;
      this.sortCriteriaSimple = null;
      this.sortDirty = false;

      if (options.queueSortPhase === true) {
        this.queueSortPhase();
      }
    };

    /**
     * applySort() - Used to apply a sort to the dynamic view
     * @example
     * dv.applySort(function(obj1, obj2) {
     *   if (obj1.name === obj2.name) return 0;
     *   if (obj1.name > obj2.name) return 1;
     *   if (obj1.name < obj2.name) return -1;
     * });
     *
     * @param {function} comparefun - a javascript compare function used for sorting
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applySort = function (comparefun) {
      this.sortFunction = comparefun;
      this.sortCriteria = null;
      this.sortCriteriaSimple = null;

      this.queueSortPhase();

      return this;
    };

    /**
     * applySimpleSort() - Used to specify a property used for view translation.
     * @example
     * dv.applySimpleSort("name");
     *
     * @param {string} propname - Name of property by which to sort.
     * @param {object|boolean=} options - boolean for sort descending or options object
     * @param {boolean} [options.desc=false] - whether we should sort descending.
     * @param {boolean} [options.disableIndexIntersect=false] - whether we should explicity not use array intersection.
     * @param {boolean} [options.forceIndexIntersect=false] - force array intersection (if binary index exists).
     * @param {boolean} [options.useJavascriptSorting=false] - whether results are sorted via basic javascript sort.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applySimpleSort = function (propname, options) {
      this.sortCriteriaSimple = { propname: propname, options: options || false };
      this.sortCriteria = null;
      this.sortFunction = null;

      this.queueSortPhase();

      return this;
    };

    /**
     * applySortCriteria() - Allows sorting a resultset based on multiple columns.
     * @example
     * // to sort by age and then name (both ascending)
     * dv.applySortCriteria(['age', 'name']);
     * // to sort by age (ascending) and then by name (descending)
     * dv.applySortCriteria(['age', ['name', true]);
     * // to sort by age (descending) and then by name (descending)
     * dv.applySortCriteria(['age', true], ['name', true]);
     *
     * @param {array} properties - array of property names or subarray of [propertyname, isdesc] used evaluate sort order
     * @returns {DynamicView} Reference to this DynamicView, sorted, for future chain operations.
     * @memberof DynamicView
     */
    DynamicView.prototype.applySortCriteria = function (criteria) {
      this.sortCriteria = criteria;
      this.sortCriteriaSimple = null;
      this.sortFunction = null;

      this.queueSortPhase();

      return this;
    };

    /**
     * startTransaction() - marks the beginning of a transaction.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.startTransaction = function () {
      this.cachedresultset = this.resultset.copy();

      return this;
    };

    /**
     * commit() - commits a transaction.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.commit = function () {
      this.cachedresultset = null;

      return this;
    };

    /**
     * rollback() - rolls back a transaction.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.rollback = function () {
      this.resultset = this.cachedresultset;

      if (this.options.persistent) {
        this.resultdata = this.resultset.data();

        this.emit('rebuild', this);
      }

      return this;
    };


    /**
     * Implementation detail.
     * _indexOfFilterWithId() - Find the index of a filter in the pipeline, by that filter's ID.
     *
     * @param {(string|number)} uid - The unique ID of the filter.
     * @returns {number}: index of the referenced filter in the pipeline; -1 if not found.
     */
    DynamicView.prototype._indexOfFilterWithId = function (uid) {
      if (typeof uid === 'string' || typeof uid === 'number') {
        for (var idx = 0, len = this.filterPipeline.length; idx < len; idx += 1) {
          if (uid === this.filterPipeline[idx].uid) {
            return idx;
          }
        }
      }
      return -1;
    };

    /**
     * Implementation detail.
     * _addFilter() - Add the filter object to the end of view's filter pipeline and apply the filter to the resultset.
     *
     * @param {object} filter - The filter object. Refer to applyFilter() for extra details.
     */
    DynamicView.prototype._addFilter = function (filter) {
      this.filterPipeline.push(filter);
      this.resultset[filter.type](filter.val);
    };

    /**
     * reapplyFilters() - Reapply all the filters in the current pipeline.
     *
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     */
    DynamicView.prototype.reapplyFilters = function () {
      this.resultset.reset();

      this.cachedresultset = null;
      if (this.options.persistent) {
        this.resultdata = [];
        this.resultsdirty = true;
      }

      var filters = this.filterPipeline;
      this.filterPipeline = [];

      for (var idx = 0, len = filters.length; idx < len; idx += 1) {
        this._addFilter(filters[idx]);
      }

      if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
        this.queueSortPhase();
      } else {
        this.queueRebuildEvent();
      }

      return this;
    };

    /**
     * applyFilter() - Adds or updates a filter in the DynamicView filter pipeline
     *
     * @param {object} filter - A filter object to add to the pipeline.
     *    The object is in the format { 'type': filter_type, 'val', filter_param, 'uid', optional_filter_id }
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applyFilter = function (filter) {
      var idx = this._indexOfFilterWithId(filter.uid);
      if (idx >= 0) {
        this.filterPipeline[idx] = filter;
        return this.reapplyFilters();
      }

      this.cachedresultset = null;
      if (this.options.persistent) {
        this.resultdata = [];
        this.resultsdirty = true;
      }

      this._addFilter(filter);

      if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
        this.queueSortPhase();
      } else {
        this.queueRebuildEvent();
      }

      return this;
    };

    /**
     * applyFind() - Adds or updates a mongo-style query option in the DynamicView filter pipeline
     *
     * @param {object} query - A mongo-style query object to apply to pipeline
     * @param {(string|number)=} uid - Optional: The unique ID of this filter, to reference it in the future.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applyFind = function (query, uid) {
      this.applyFilter({
        type: 'find',
        val: query,
        uid: uid
      });
      return this;
    };

    /**
     * applyWhere() - Adds or updates a javascript filter function in the DynamicView filter pipeline
     *
     * @param {function} fun - A javascript filter function to apply to pipeline
     * @param {(string|number)=} uid - Optional: The unique ID of this filter, to reference it in the future.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.applyWhere = function (fun, uid) {
      this.applyFilter({
        type: 'where',
        val: fun,
        uid: uid
      });
      return this;
    };

    /**
     * removeFilter() - Remove the specified filter from the DynamicView filter pipeline
     *
     * @param {(string|number)} uid - The unique ID of the filter to be removed.
     * @returns {DynamicView} this DynamicView object, for further chain ops.
     * @memberof DynamicView
     */
    DynamicView.prototype.removeFilter = function (uid) {
      var idx = this._indexOfFilterWithId(uid);
      if (idx < 0) {
        throw new Error("Dynamic view does not contain a filter with ID: " + uid);
      }

      this.filterPipeline.splice(idx, 1);
      this.reapplyFilters();
      return this;
    };

    /**
     * count() - returns the number of documents representing the current DynamicView contents.
     *
     * @returns {number} The number of documents representing the current DynamicView contents.
     * @memberof DynamicView
     */
    DynamicView.prototype.count = function () {
      if (this.resultsdirty) {
        this.resultdata = this.resultset.data();
      }

      return this.resultset.count();
    };

    /**
     * data() - resolves and pending filtering and sorting, then returns document array as result.
     *
     * @param {object=} options - optional parameters to pass to resultset.data() if non-persistent
     * @param {boolean} options.forceClones - Allows forcing the return of cloned objects even when
     *        the collection is not configured for clone object.
     * @param {string} options.forceCloneMethod - Allows overriding the default or collection specified cloning method.
     *        Possible values include 'parse-stringify', 'jquery-extend-deep', 'shallow', 'shallow-assign'
     * @param {bool} options.removeMeta - Will force clones and strip $loki and meta properties from documents
     * @returns {array} An array of documents representing the current DynamicView contents.
     * @memberof DynamicView
     */
    DynamicView.prototype.data = function (options) {
      if (this.sortDirty || this.resultsdirty) {
        this.performSortPhase({
          suppressRebuildEvent: true
        });
      }
      return (this.options.persistent) ? (this.resultdata) : (this.resultset.data(options));
    };

    /**
     * queueRebuildEvent() - When the view is not sorted we may still wish to be notified of rebuild events.
     *     This event will throttle and queue a single rebuild event when batches of updates affect the view.
     */
    DynamicView.prototype.queueRebuildEvent = function () {
      if (this.rebuildPending) {
        return;
      }
      this.rebuildPending = true;

      var self = this;
      setTimeout(function () {
        if (self.rebuildPending) {
          self.rebuildPending = false;
          self.emit('rebuild', self);
        }
      }, this.options.minRebuildInterval);
    };

    /**
     * queueSortPhase : If the view is sorted we will throttle sorting to either :
     *    (1) passive - when the user calls data(), or
     *    (2) active - once they stop updating and yield js thread control
     */
    DynamicView.prototype.queueSortPhase = function () {
      if (this.sortDirty) {
        return;
      }
      this.sortDirty = true;

      var self = this;
      if (this.options.sortPriority === "active") {
        setTimeout(function () {
          self.performSortPhase();
        }, this.options.minRebuildInterval);
      } else {
        this.queueRebuildEvent();
      }
    };

    /**
     * performSortPhase() - invoked synchronously or asynchronously to perform final sort phase (if needed)
     *
     */
    DynamicView.prototype.performSortPhase = function (options) {
      if (!this.sortDirty && !this.resultsdirty) {
        return;
      }

      options = options || {};

      if (this.sortDirty) {
        if (this.sortFunction) {
          this.resultset.sort(this.sortFunction);
        } else if (this.sortCriteria) {
          this.resultset.compoundsort(this.sortCriteria);
        } else if (this.sortCriteriaSimple) {
          this.resultset.simplesort(this.sortCriteriaSimple.propname, this.sortCriteriaSimple.options);
        }

        this.sortDirty = false;
      }

      if (this.options.persistent) {
        this.resultdata = this.resultset.data();
        this.resultsdirty = false;
      }

      if (!options.suppressRebuildEvent) {
        this.emit('rebuild', this);
      }
    };

    /**
     * evaluateDocument() - internal method for (re)evaluating document inclusion.
     *    Called by : collection.insert() and collection.update().
     *
     * @param {int} objIndex - index of document to (re)run through filter pipeline.
     * @param {bool} isNew - true if the document was just added to the collection.
     */
    DynamicView.prototype.evaluateDocument = function (objIndex, isNew) {
      if (!this.resultset.filterInitialized) {
        if (this.options.persistent) {
          this.resultdata = this.resultset.data();
        }
        if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }
        return;
      }

      var ofr = this.resultset.filteredrows;
      var oldPos = (isNew) ? (-1) : (ofr.indexOf(+objIndex));
      var oldlen = ofr.length;
      var evalResultset = new Resultset(this.collection);
      evalResultset.filteredrows = [objIndex];
      evalResultset.filterInitialized = true;
      var filter;
      for (var idx = 0, len = this.filterPipeline.length; idx < len; idx++) {
        filter = this.filterPipeline[idx];
        evalResultset[filter.type](filter.val);
      }
      var newPos = (evalResultset.filteredrows.length === 0) ? -1 : 0;
      if (oldPos === -1 && newPos === -1) return;
      if (oldPos === -1 && newPos !== -1) {
        ofr.push(objIndex);

        if (this.options.persistent) {
          this.resultdata.push(this.collection.data[objIndex]);
        }
        if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }

        return;
      }
      if (oldPos !== -1 && newPos === -1) {
        if (oldPos < oldlen - 1) {
          ofr.splice(oldPos, 1);

          if (this.options.persistent) {
            this.resultdata.splice(oldPos, 1);
          }
        } else {
          ofr.length = oldlen - 1;

          if (this.options.persistent) {
            this.resultdata.length = oldlen - 1;
          }
        }
        if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }

        return;
      }
      if (oldPos !== -1 && newPos !== -1) {
        if (this.options.persistent) {
          this.resultdata[oldPos] = this.collection.data[objIndex];
        }
        if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }

        return;
      }
    };

    /**
     * removeDocument() - internal function called on collection.delete()
     * @param {number|number[]} objIndex - index of document to (re)run through filter pipeline.
     */
    DynamicView.prototype.removeDocument = function (objIndex) {
      var idx, rmidx, rmlen, rxo = {}, fxo = {};
      var adjels = [];
      var drs = this.resultset;
      var fr = this.resultset.filteredrows;
      var frlen = fr.length;
      if (!this.resultset.filterInitialized) {
        if (this.options.persistent) {
          this.resultdata = this.resultset.data();
        }
        if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }
        return;
      }
      if (!Array.isArray(objIndex)) {
        objIndex = [objIndex];
      }

      rmlen = objIndex.length;
      for(rmidx=0;rmidx<rmlen; rmidx++) {
        rxo[objIndex[rmidx]] = true;
      }
      for (idx=0; idx<frlen; idx++) {
        if (rxo[fr[idx]]) fxo[idx] = true;
      }
      if (Object.keys(fxo).length > 0) {
        this.resultset.filteredrows = this.resultset.filteredrows.filter(function(di, idx) { return !fxo[idx]; });
        if (this.options.persistent) {
          this.resultdata = this.resultdata.filter(function(obj, idx) { return !fxo[idx]; });
        }
        if (this.sortFunction || this.sortCriteria || this.sortCriteriaSimple) {
          this.queueSortPhase();
        } else {
          this.queueRebuildEvent();
        }
      }
      var filt = function(idx) { return function(di) { return di < drs.filteredrows[idx]; }; };

      frlen = drs.filteredrows.length;
      for (idx = 0; idx < frlen; idx++) {
        adjels = objIndex.filter(filt(idx));
        drs.filteredrows[idx] -= adjels.length;
      }
    };

    /**
     * mapReduce() - data transformation via user supplied functions
     *
     * @param {function} mapFunction - this function accepts a single document for you to transform and return
     * @param {function} reduceFunction - this function accepts many (array of map outputs) and returns single value
     * @returns The output of your reduceFunction
     * @memberof DynamicView
     */
    DynamicView.prototype.mapReduce = function (mapFunction, reduceFunction) {
      try {
        return reduceFunction(this.data().map(mapFunction));
      } catch (err) {
        throw err;
      }
    };


    /**
     * Collection class that handles documents of same type
     * @constructor Collection
     * @implements LokiEventEmitter
     * @param {string} name - collection name
     * @param {(array|object)=} options - (optional) array of property names to be indicized OR a configuration object
     * @param {array=} [options.unique=[]] - array of property names to define unique constraints for
     * @param {array=} [options.exact=[]] - array of property names to define exact constraints for
     * @param {array=} [options.indices=[]] - array property names to define binary indexes for
     * @param {boolean} [options.adaptiveBinaryIndices=true] - collection indices will be actively rebuilt rather than lazily
     * @param {boolean} [options.asyncListeners=false] - whether listeners are invoked asynchronously
     * @param {boolean} [options.disableMeta=false] - set to true to disable meta property on documents
     * @param {boolean} [options.disableChangesApi=true] - set to false to enable Changes API
     * @param {boolean} [options.disableDeltaChangesApi=true] - set to false to enable Delta Changes API (requires Changes API, forces cloning)
     * @param {boolean} [options.autoupdate=false] - use Object.observe to update objects automatically
     * @param {boolean} [options.clone=false] - specify whether inserts and queries clone to/from user
     * @param {boolean} [options.serializableIndices=true[]] - converts date values on binary indexed properties to epoch time
     * @param {string} [options.cloneMethod='parse-stringify'] - 'parse-stringify', 'jquery-extend-deep', 'shallow', 'shallow-assign'
     * @param {int=} options.ttl - age of document (in ms.) before document is considered aged/stale.
     * @param {int=} options.ttlInterval - time interval for clearing out 'aged' documents; not set by default.
     * @see {@link Loki#addCollection} for normal creation of collections
     */
    function Collection(name, options) {

      this.name = name;
      this.data = [];
      this.idIndex = []; // index of id
      this.binaryIndices = {}; // user defined indexes
      this.constraints = {
        unique: {},
        exact: {}
      };
      this.uniqueNames = [];
      this.transforms = {};
      this.objType = name;
      this.dirty = true;
      this.cachedIndex = null;
      this.cachedBinaryIndex = null;
      this.cachedData = null;
      var self = this;

      /* OPTIONS */
      options = options || {};
      if (options.hasOwnProperty('unique')) {
        if (!Array.isArray(options.unique)) {
          options.unique = [options.unique];
        }
        options.unique.forEach(function (prop) {
          self.uniqueNames.push(prop); // used to regenerate on subsequent database loads
          self.constraints.unique[prop] = new UniqueIndex(prop);
        });
      }

      if (options.hasOwnProperty('exact')) {
        options.exact.forEach(function (prop) {
          self.constraints.exact[prop] = new ExactIndex(prop);
        });
      }
      this.adaptiveBinaryIndices = options.hasOwnProperty('adaptiveBinaryIndices') ? options.adaptiveBinaryIndices : true;
      this.transactional = options.hasOwnProperty('transactional') ? options.transactional : false;
      this.cloneObjects = options.hasOwnProperty('clone') ? options.clone : false;
      this.cloneMethod = options.hasOwnProperty('cloneMethod') ? options.cloneMethod : "parse-stringify";
      this.asyncListeners = options.hasOwnProperty('asyncListeners') ? options.asyncListeners : false;
      this.disableMeta = options.hasOwnProperty('disableMeta') ? options.disableMeta : false;
      this.disableChangesApi = options.hasOwnProperty('disableChangesApi') ? options.disableChangesApi : true;
      this.disableDeltaChangesApi = options.hasOwnProperty('disableDeltaChangesApi') ? options.disableDeltaChangesApi : true;
      if (this.disableChangesApi) { this.disableDeltaChangesApi = true; }
      this.autoupdate = options.hasOwnProperty('autoupdate') ? options.autoupdate : false;
      this.serializableIndices = options.hasOwnProperty('serializableIndices') ? options.serializableIndices : true;
      this.ttl = {
        age: null,
        ttlInterval: null,
        daemon: null
      };
      this.setTTL(options.ttl || -1, options.ttlInterval);
      this.maxId = 0;

      this.DynamicViews = [];
      this.events = {
        'insert': [],
        'update': [],
        'pre-insert': [],
        'pre-update': [],
        'close': [],
        'flushbuffer': [],
        'error': [],
        'delete': [],
        'warning': []
      };
      this.changes = [];
      this.ensureId();
      var indices = [];
      if (options && options.indices) {
        if (Object.prototype.toString.call(options.indices) === '[object Array]') {
          indices = options.indices;
        } else if (typeof options.indices === 'string') {
          indices = [options.indices];
        } else {
          throw new TypeError('Indices needs to be a string or an array of strings');
        }
      }

      for (var idx = 0; idx < indices.length; idx++) {
        this.ensureIndex(indices[idx]);
      }

      function observerCallback(changes) {

        var changedObjects = typeof Set === 'function' ? new Set() : [];

        if (!changedObjects.add)
          changedObjects.add = function (object) {
            if (this.indexOf(object) === -1)
              this.push(object);
            return this;
          };

        changes.forEach(function (change) {
          changedObjects.add(change.object);
        });

        changedObjects.forEach(function (object) {
          if (!hasOwnProperty.call(object, '$loki'))
            return self.removeAutoUpdateObserver(object);
          try {
            self.update(object);
          } catch (err) {}
        });
      }

      this.observerCallback = observerCallback;
      function getChangeDelta(obj, old) {
        if (old) {
          return getObjectDelta(old, obj);
        }
        else {
          return JSON.parse(JSON.stringify(obj));
        }
      }

      this.getChangeDelta = getChangeDelta;

      function getObjectDelta(oldObject, newObject) {
        var propertyNames = newObject !== null && typeof newObject === 'object' ? Object.keys(newObject) : null;
        if (propertyNames && propertyNames.length && ['string', 'boolean', 'number'].indexOf(typeof(newObject)) < 0) {
          var delta = {};
          for (var i = 0; i < propertyNames.length; i++) {
            var propertyName = propertyNames[i];
            if (newObject.hasOwnProperty(propertyName)) {
              if (!oldObject.hasOwnProperty(propertyName) || self.uniqueNames.indexOf(propertyName) >= 0 || propertyName == '$loki' || propertyName == 'meta') {
                delta[propertyName] = newObject[propertyName];
              }
              else {
                var propertyDelta = getObjectDelta(oldObject[propertyName], newObject[propertyName]);
                if (typeof propertyDelta !== "undefined" && propertyDelta != {}) {
                  delta[propertyName] = propertyDelta;
                }
              }
            }
          }
          return Object.keys(delta).length === 0 ? undefined : delta;
        }
        else {
          return oldObject === newObject ? undefined : newObject;
        }
      }

      this.getObjectDelta = getObjectDelta;
      function flushChanges() {
        self.changes = [];
      }

      this.getChanges = function () {
        return self.changes;
      };

      this.flushChanges = flushChanges;

      this.setChangesApi = function (enabled) {
        self.disableChangesApi = !enabled;
        if (!enabled) { self.disableDeltaChangesApi = false; }
      };

      this.on('delete', function deleteCallback(obj) {
        if (!self.disableChangesApi) {
          self.createChange(self.name, 'R', obj);
        }
      });

      this.on('warning', function (warning) {
        self.console.warn(warning);
      });
      flushChanges();
    }

    Collection.prototype = new LokiEventEmitter();

    /*
      * For ChangeAPI default to clone entire object, for delta changes create object with only differences (+ $loki and meta)
      */
    Collection.prototype.createChange = function(name, op, obj, old) {
      this.changes.push({
        name: name,
        operation: op,
        obj: op == 'U' && !this.disableDeltaChangesApi ? this.getChangeDelta(obj, old) : JSON.parse(JSON.stringify(obj))
      });
    };

    Collection.prototype.insertMeta = function(obj) {
      var len, idx;

      if (this.disableMeta || !obj) {
        return;
      }
      if (Array.isArray(obj)) {
        len = obj.length;

        for(idx=0; idx<len; idx++) {
          if (!obj[idx].hasOwnProperty('meta')) {
            obj[idx].meta = {};
          }

          obj[idx].meta.created = (new Date()).getTime();
          obj[idx].meta.revision = 0;
        }

        return;
      }
      if (!obj.meta) {
        obj.meta = {};
      }

      obj.meta.created = (new Date()).getTime();
      obj.meta.revision = 0;
    };

    Collection.prototype.updateMeta = function(obj) {
      if (this.disableMeta || !obj) {
        return;
      }
      obj.meta.updated = (new Date()).getTime();
      obj.meta.revision += 1;
    };

    Collection.prototype.createInsertChange = function(obj) {
      this.createChange(this.name, 'I', obj);
    };

    Collection.prototype.createUpdateChange = function(obj, old) {
      this.createChange(this.name, 'U', obj, old);
    };

    Collection.prototype.insertMetaWithChange = function(obj) {
      this.insertMeta(obj);
      this.createInsertChange(obj);
    };

    Collection.prototype.updateMetaWithChange = function(obj, old) {
      this.updateMeta(obj);
      this.createUpdateChange(obj, old);
    };

    Collection.prototype.console = {
      log: function () {},
      warn: function () {},
      error: function () {},
    };

    Collection.prototype.addAutoUpdateObserver = function (object) {
      if (!this.autoupdate || typeof Object.observe !== 'function')
        return;

      Object.observe(object, this.observerCallback, ['add', 'update', 'delete', 'reconfigure', 'setPrototype']);
    };

    Collection.prototype.removeAutoUpdateObserver = function (object) {
      if (!this.autoupdate || typeof Object.observe !== 'function')
        return;

      Object.unobserve(object, this.observerCallback);
    };

    /**
     * Adds a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {array} transform - an array of transformation 'step' objects to save into the collection
     * @memberof Collection
     * @example
     * users.addTransform('progeny', [
     *   {
     *     type: 'find',
     *     value: {
     *       'age': {'$lte': 40}
     *     }
     *   }
     * ]);
     *
     * var results = users.chain('progeny').data();
     */
    Collection.prototype.addTransform = function (name, transform) {
      if (this.transforms.hasOwnProperty(name)) {
        throw new Error("a transform by that name already exists");
      }

      this.transforms[name] = transform;
    };

    /**
     * Retrieves a named transform from the collection.
     * @param {string} name - name of the transform to lookup.
     * @memberof Collection
     */
    Collection.prototype.getTransform = function (name) {
      return this.transforms[name];
    };

    /**
     * Updates a named collection transform to the collection
     * @param {string} name - name to associate with transform
     * @param {object} transform - a transformation object to save into collection
     * @memberof Collection
     */
    Collection.prototype.setTransform = function (name, transform) {
      this.transforms[name] = transform;
    };

    /**
     * Removes a named collection transform from the collection
     * @param {string} name - name of collection transform to remove
     * @memberof Collection
     */
    Collection.prototype.removeTransform = function (name) {
      delete this.transforms[name];
    };

    Collection.prototype.byExample = function (template) {
      var k, obj, query;
      query = [];
      for (k in template) {
        if (!template.hasOwnProperty(k)) continue;
        query.push((
          obj = {},
          obj[k] = template[k],
          obj
        ));
      }
      return {
        '$and': query
      };
    };

    Collection.prototype.findObject = function (template) {
      return this.findOne(this.byExample(template));
    };

    Collection.prototype.findObjects = function (template) {
      return this.find(this.byExample(template));
    };

    /*----------------------------+
    | TTL daemon                  |
    +----------------------------*/
    Collection.prototype.ttlDaemonFuncGen = function () {
      var collection = this;
      var age = this.ttl.age;
      return function ttlDaemon() {
        var now = Date.now();
        var toRemove = collection.chain().where(function daemonFilter(member) {
          var timestamp = member.meta.updated || member.meta.created;
          var diff = now - timestamp;
          return age < diff;
        });
        toRemove.remove();
      };
    };

    /**
     * Updates or applies collection TTL settings.
     * @param {int} age - age (in ms) to expire document from collection
     * @param {int} interval - time (in ms) to clear collection of aged documents.
     * @memberof Collection
     */
    Collection.prototype.setTTL = function (age, interval) {
      if (age < 0) {
        clearInterval(this.ttl.daemon);
      } else {
        this.ttl.age = age;
        this.ttl.ttlInterval = interval;
        this.ttl.daemon = setInterval(this.ttlDaemonFuncGen(), interval);
      }
    };

    /*----------------------------+
    | INDEXING                    |
    +----------------------------*/

    /**
     * create a row filter that covers all documents in the collection
     */
    Collection.prototype.prepareFullDocIndex = function () {
      var len = this.data.length;
      var indexes = new Array(len);
      for (var i = 0; i < len; i += 1) {
        indexes[i] = i;
      }
      return indexes;
    };

    /**
     * Will allow reconfiguring certain collection options.
     * @param {boolean} options.adaptiveBinaryIndices - collection indices will be actively rebuilt rather than lazily
     * @memberof Collection
     */
    Collection.prototype.configureOptions = function (options) {
      options = options || {};

      if (options.hasOwnProperty('adaptiveBinaryIndices')) {
        this.adaptiveBinaryIndices = options.adaptiveBinaryIndices;
        if (this.adaptiveBinaryIndices) {
          this.ensureAllIndexes();
        }
      }
    };

    /**
     * Ensure binary index on a certain field
     * @param {string} property - name of property to create binary index on
     * @param {boolean=} force - (Optional) flag indicating whether to construct index immediately
     * @memberof Collection
     */
    Collection.prototype.ensureIndex = function (property, force) {
      if (typeof (force) === 'undefined') {
        force = false;
      }

      if (property === null || property === undefined) {
        throw new Error('Attempting to set index without an associated property');
      }

      if (this.binaryIndices[property] && !force) {
        if (!this.binaryIndices[property].dirty) return;
      }
      if (this.adaptiveBinaryIndices === true && this.binaryIndices.hasOwnProperty(property) && !force) {
        return;
      }

      var index = {
        'name': property,
        'dirty': true,
        'values': this.prepareFullDocIndex()
      };
      this.binaryIndices[property] = index;

      var wrappedComparer =
        (function (prop, data) {
          var val1, val2, arr;
          return function (a, b) {
            if (~prop.indexOf('.')) {
              arr = prop.split('.');
              val1 = arr.reduce(function(obj, i) { return obj && obj[i] || undefined; }, data[a]);
              val2 = arr.reduce(function(obj, i) { return obj && obj[i] || undefined; }, data[b]);
            } else {
              val1 = data[a][prop];
              val2 = data[b][prop];
            }

            if (val1 !== val2) {
              if (Comparators.lt(val1, val2, false)) return -1;
              if (Comparators.gt(val1, val2, false)) return 1;
            }
            return 0;
          };
        })(property, this.data);

      index.values.sort(wrappedComparer);
      index.dirty = false;

      this.dirty = true; // for autosave scenarios
    };

    /**
     * Perform checks to determine validity/consistency of all binary indices
     * @param {object=} options - optional configuration object
     * @param {boolean} [options.randomSampling=false] - whether (faster) random sampling should be used
     * @param {number} [options.randomSamplingFactor=0.10] - percentage of total rows to randomly sample
     * @param {boolean} [options.repair=false] - whether to fix problems if they are encountered
     * @returns {string[]} array of index names where problems were found.
     * @memberof Collection
     * @example
     * // check all indices on a collection, returns array of invalid index names
     * var result = coll.checkAllIndexes({ repair: true, randomSampling: true, randomSamplingFactor: 0.15 });
     * if (result.length > 0) {
     *   results.forEach(function(name) { 
     *     console.log('problem encountered with index : ' + name); 
     *   });
     * }     
     */
    Collection.prototype.checkAllIndexes = function (options) {
      var key, bIndices = this.binaryIndices;
      var results = [], result;

      for (key in bIndices) {
        if (hasOwnProperty.call(bIndices, key)) {
          result = this.checkIndex(key, options);
          if (!result) {
            results.push(key);
          }
        }
      }

      return results;
    };

    /**
     * Perform checks to determine validity/consistency of a binary index
     * @param {string} property - name of the binary-indexed property to check
     * @param {object=} options - optional configuration object
     * @param {boolean} [options.randomSampling=false] - whether (faster) random sampling should be used
     * @param {number} [options.randomSamplingFactor=0.10] - percentage of total rows to randomly sample
     * @param {boolean} [options.repair=false] - whether to fix problems if they are encountered
     * @returns {boolean} whether the index was found to be valid (before optional correcting).
     * @memberof Collection
     * @example
     * // full test
     * var valid = coll.checkIndex('name');
     * // full test with repair (if issues found)
     * valid = coll.checkIndex('name', { repair: true });
     * // random sampling (default is 10% of total document count)
     * valid = coll.checkIndex('name', { randomSampling: true });
     * // random sampling (sample 20% of total document count)
     * valid = coll.checkIndex('name', { randomSampling: true, randomSamplingFactor: 0.20 });
     * // random sampling (implied boolean)
     * valid = coll.checkIndex('name', { randomSamplingFactor: 0.20 });
     * // random sampling with repair (if issues found)
     * valid = coll.checkIndex('name', { repair: true, randomSampling: true });
     */
    Collection.prototype.checkIndex = function (property, options) {
      options = options || {};
      if (options.randomSamplingFactor && options.randomSampling !== false) {
        options.randomSampling = true;
      }
      options.randomSamplingFactor = options.randomSamplingFactor || 0.1;
      if (options.randomSamplingFactor < 0 || options.randomSamplingFactor > 1) {
        options.randomSamplingFactor = 0.1;
      }

      var valid=true, idx, iter, pos, len, biv;
      if (!this.binaryIndices.hasOwnProperty(property)) {
        throw new Error("called checkIndex on property without an index: " + property);
      }
      if (!this.adaptiveBinaryIndices) {
        this.ensureIndex(property);
      }

      biv = this.binaryIndices[property].values;
      len = biv.length;
      if (len !== this.data.length) {
        if (options.repair) {
          this.ensureIndex(property, true);
        }
        return false;
      }

      if (len === 0) {
        return true;
      }

      if (len === 1) {
        valid = (biv[0] === 0);
      }
      else {
        if (options.randomSampling) {
          if (!LokiOps.$lte(this.data[biv[0]][property], this.data[biv[1]][property])) {
            valid=false;
          }
          if (!LokiOps.$lte(this.data[biv[len-2]][property], this.data[biv[len-1]][property])) {
            valid=false;
          }
          if (valid) {
            iter = Math.floor((len-1) * options.randomSamplingFactor);
            for(idx=0; idx<iter-1; idx++) {
              pos = Math.floor(Math.random() * (len-1));
              if (!LokiOps.$lte(this.data[biv[pos]][property], this.data[biv[pos+1]][property])) {
                valid=false;
                break;
              }
            }
          }
        }
        else {
          for(idx=0; idx<len-1; idx++) {
            if (!LokiOps.$lte(this.data[biv[idx]][property], this.data[biv[idx+1]][property])) {
              valid=false;
              break;
            }
          }
        }
      }
      if (!valid && options.repair) {
        this.ensureIndex(property, true);
      }

      return valid;
    };

    Collection.prototype.getBinaryIndexValues = function (property) {
      var idx, idxvals = this.binaryIndices[property].values;
      var result = [];

      for (idx = 0; idx < idxvals.length; idx++) {
        result.push(this.data[idxvals[idx]][property]);
      }

      return result;
    };

    Collection.prototype.ensureUniqueIndex = function (field) {
      var index = this.constraints.unique[field];
      if (!index) {
        if (this.uniqueNames.indexOf(field) == -1) {
          this.uniqueNames.push(field);
        }
      }
      this.constraints.unique[field] = index = new UniqueIndex(field);
      this.data.forEach(function (obj) {
        index.set(obj);
      });
      return index;
    };

    /**
     * Ensure all binary indices
     * @param {boolean} force - whether to force rebuild of existing lazy binary indices
     * @memberof Collection
     */
    Collection.prototype.ensureAllIndexes = function (force) {
      var key, bIndices = this.binaryIndices;
      for (key in bIndices) {
        if (hasOwnProperty.call(bIndices, key)) {
          this.ensureIndex(key, force);
        }
      }
    };

    /**
     * Internal method used to flag all lazy index as dirty
     */
    Collection.prototype.flagBinaryIndexesDirty = function () {
      var key, bIndices = this.binaryIndices;
      for (key in bIndices) {
        if (hasOwnProperty.call(bIndices, key)) {
          bIndices[key].dirty = true;
        }
      }
    };

    /**
     * Internal method used to flag a lazy index as dirty
     */
    Collection.prototype.flagBinaryIndexDirty = function (index) {
      if (this.binaryIndices[index])
        this.binaryIndices[index].dirty = true;
    };

    /**
     * Quickly determine number of documents in collection (or query)
     * @param {object=} query - (optional) query object to count results of
     * @returns {number} number of documents in the collection
     * @memberof Collection
     */
    Collection.prototype.count = function (query) {
      if (!query) {
        return this.data.length;
      }

      return this.chain().find(query).filteredrows.length;
    };

    /**
     * Rebuild idIndex
     */
    Collection.prototype.ensureId = function () {
      var len = this.data.length,
        i = 0;

      this.idIndex = [];
      for (i; i < len; i += 1) {
        this.idIndex.push(this.data[i].$loki);
      }
    };

    /**
     * Rebuild idIndex async with callback - useful for background syncing with a remote server
     */
    Collection.prototype.ensureIdAsync = function (callback) {
      this.async(function () {
        this.ensureId();
      }, callback);
    };

    /**
     * Add a dynamic view to the collection
     * @param {string} name - name of dynamic view to add
     * @param {object=} options - options to configure dynamic view with
     * @param {boolean} [options.persistent=false] - indicates if view is to main internal results array in 'resultdata'
     * @param {string} [options.sortPriority='passive'] - 'passive' (sorts performed on call to data) or 'active' (after updates)
     * @param {number} options.minRebuildInterval - minimum rebuild interval (need clarification to docs here)
     * @returns {DynamicView} reference to the dynamic view added
     * @memberof Collection
     * @example
     * var pview = users.addDynamicView('progeny');
     * pview.applyFind({'age': {'$lte': 40}});
     * pview.applySimpleSort('name');
     *
     * var results = pview.data();
     **/

    Collection.prototype.addDynamicView = function (name, options) {
      var dv = new DynamicView(this, name, options);
      this.DynamicViews.push(dv);

      return dv;
    };

    /**
     * Remove a dynamic view from the collection
     * @param {string} name - name of dynamic view to remove
     * @memberof Collection
     **/
    Collection.prototype.removeDynamicView = function (name) {
      for (var idx = 0; idx < this.DynamicViews.length; idx++) {
        if (this.DynamicViews[idx].name === name) {
          this.DynamicViews.splice(idx, 1);
        }
      }
    };

    /**
     * Look up dynamic view reference from within the collection
     * @param {string} name - name of dynamic view to retrieve reference of
     * @returns {DynamicView} A reference to the dynamic view with that name
     * @memberof Collection
     **/
    Collection.prototype.getDynamicView = function (name) {
      for (var idx = 0; idx < this.DynamicViews.length; idx++) {
        if (this.DynamicViews[idx].name === name) {
          return this.DynamicViews[idx];
        }
      }

      return null;
    };

    /**
     * Applies a 'mongo-like' find query object and passes all results to an update function.
     * For filter function querying you should migrate to [updateWhere()]{@link Collection#updateWhere}.
     *
     * @param {object|function} filterObject - 'mongo-like' query object (or deprecated filterFunction mode)
     * @param {function} updateFunction - update function to run against filtered documents
     * @memberof Collection
     */
    Collection.prototype.findAndUpdate = function (filterObject, updateFunction) {
      if (typeof (filterObject) === "function") {
        this.updateWhere(filterObject, updateFunction);
      }
      else {
        this.chain().find(filterObject).update(updateFunction);
      }
    };

    /**
     * Applies a 'mongo-like' find query object removes all documents which match that filter.
     *
     * @param {object} filterObject - 'mongo-like' query object
     * @memberof Collection
     */
    Collection.prototype.findAndRemove = function(filterObject) {
      this.chain().find(filterObject).remove();
    };

    /**
     * Adds object(s) to collection, ensure object(s) have meta properties, clone it if necessary, etc.
     * @param {(object|array)} doc - the document (or array of documents) to be inserted
     * @returns {(object|array)} document or documents inserted
     * @memberof Collection
     * @example
     * users.insert({
     *     name: 'Odin',
     *     age: 50,
     *     address: 'Asgard'
     * });
     *
     * // alternatively, insert array of documents
     * users.insert([{ name: 'Thor', age: 35}, { name: 'Loki', age: 30}]);
     */
    Collection.prototype.insert = function (doc) {
      if (!Array.isArray(doc)) {
        return this.insertOne(doc);
      }
      var obj;
      var results = [];

      this.emit('pre-insert', doc);
      for (var i = 0, len = doc.length; i < len; i++) {
        obj = this.insertOne(doc[i], true);
        if (!obj) {
          return undefined;
        }
        results.push(obj);
      }
      this.emit('insert', results);
      results = this.cloneObjects ? clone(results, this.cloneMethod) : results;

      return results.length === 1 ? results[0] : results;
    };

    /**
     * Adds a single object, ensures it has meta properties, clone it if necessary, etc.
     * @param {object} doc - the document to be inserted
     * @param {boolean} bulkInsert - quiet pre-insert and insert event emits
     * @returns {object} document or 'undefined' if there was a problem inserting it
     */
    Collection.prototype.insertOne = function (doc, bulkInsert) {
      var err = null;
      var returnObj;

      if (typeof doc !== 'object') {
        err = new TypeError('Document needs to be an object');
      } else if (doc === null) {
        err = new TypeError('Object cannot be null');
      }

      if (err !== null) {
        this.emit('error', err);
        throw err;
      }
      var obj = this.cloneObjects ? clone(doc, this.cloneMethod) : doc;

      if (!this.disableMeta && typeof obj.meta === 'undefined') {
        obj.meta = {
          revision: 0,
          created: 0
        };
      }
      if (!bulkInsert) {
        this.emit('pre-insert', obj);
      }
      if (!this.add(obj)) {
        return undefined;
      }
      if (this.disableChangesApi) {
        this.insertMeta(obj);
      }
      else {
        this.insertMetaWithChange(obj);
      }
      returnObj = this.cloneObjects ? clone(obj, this.cloneMethod) : obj;
      if (!bulkInsert) {
        this.emit('insert', returnObj);
      }

      this.addAutoUpdateObserver(returnObj);
      return returnObj;
    };

    /**
     * Empties the collection.
     * @param {object=} options - configure clear behavior
     * @param {bool=} [options.removeIndices=false] - whether to remove indices in addition to data
     * @memberof Collection
     */
    Collection.prototype.clear = function (options) {
      var self = this;

      options = options || {};

      this.data = [];
      this.idIndex = [];
      this.cachedIndex = null;
      this.cachedBinaryIndex = null;
      this.cachedData = null;
      this.maxId = 0;
      this.DynamicViews = [];
      this.dirty = true;
      if (options.removeIndices === true) {
        this.binaryIndices = {};

        this.constraints = {
          unique: {},
          exact: {}
        };
        this.uniqueNames = [];
      }
      else {
        var keys = Object.keys(this.binaryIndices);
        keys.forEach(function(biname) {
          self.binaryIndices[biname].dirty = false;
          self.binaryIndices[biname].values = [];
        });
        this.constraints = {
          unique: {},
          exact: {}
        };
        this.uniqueNames.forEach(function(uiname) {
          self.ensureUniqueIndex(uiname);
        });
      }
    };

    /**
     * Updates an object and notifies collection that the document has changed.
     * @param {object} doc - document to update within the collection
     * @memberof Collection
     */
    Collection.prototype.update = function (doc) {
      var adaptiveBatchOverride, k, len;

      if (Array.isArray(doc)) {
        len = doc.length;
        adaptiveBatchOverride = !this.cloneObjects &&
          this.adaptiveBinaryIndices && Object.keys(this.binaryIndices).length > 0;

        if (adaptiveBatchOverride) {
          this.adaptiveBinaryIndices = false;
        }

        try {
          for (k=0; k < len; k += 1) {
            this.update(doc[k]);
          }
        }
        finally {
          if (adaptiveBatchOverride) {
            this.ensureAllIndexes();
            this.adaptiveBinaryIndices = true;
          }
        }

        return;
      }
      if (!hasOwnProperty.call(doc, '$loki')) {
        throw new Error('Trying to update unsynced document. Please save the document first by using insert() or addMany()');
      }
      try {
        this.startTransaction();
        var arr = this.get(doc.$loki, true),
          oldInternal,   // ref to existing obj
          newInternal, // ref to new internal obj
          position,
          self = this;

        if (!arr) {
          throw new Error('Trying to update a document not in collection.');
        }

        oldInternal = arr[0]; // -internal- obj ref
        position = arr[1]; // position in data array
        newInternal = this.cloneObjects || !this.disableDeltaChangesApi ? clone(doc, this.cloneMethod) : doc;

        this.emit('pre-update', doc);

        Object.keys(this.constraints.unique).forEach(function (key) {
          self.constraints.unique[key].update(oldInternal, newInternal);
        });
        this.data[position] = newInternal;

        if (newInternal !== doc) {
          this.addAutoUpdateObserver(doc);
        }
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].evaluateDocument(position, false);
        }

        var key;
        if (this.adaptiveBinaryIndices) {
          var bIndices = this.binaryIndices;
          for (key in bIndices) {
            this.adaptiveBinaryIndexUpdate(position, key);
          }
        }
        else {
          this.flagBinaryIndexesDirty();
        }

        this.idIndex[position] = newInternal.$loki;

        this.commit();
        this.dirty = true; // for autosave scenarios
        if (this.disableChangesApi) {
          this.updateMeta(newInternal, null);
        }
        else {
          this.updateMetaWithChange(newInternal, oldInternal);
        }

        var returnObj;
        if (this.cloneObjects) {
          returnObj = clone(newInternal, this.cloneMethod);
        }
        else {
          returnObj = newInternal;
        }

        this.emit('update', returnObj, oldInternal);
        return returnObj;
      } catch (err) {
        this.rollback();
        this.console.error(err.message);
        this.emit('error', err);
        throw (err); // re-throw error so user does not think it succeeded
      }
    };

    /**
     * Add object to collection
     */
    Collection.prototype.add = function (obj) {
      if ('object' !== typeof obj) {
        throw new TypeError('Object being added needs to be an object');
      }
      if (typeof (obj.$loki) !== 'undefined') {
        throw new Error('Document is already in collection, please use update()');
      }

      /*
       * try adding object to collection
       */
      try {
        this.startTransaction();
        this.maxId++;

        if (isNaN(this.maxId)) {
          this.maxId = (this.data[this.data.length - 1].$loki + 1);
        }

        obj.$loki = this.maxId;

        if (!this.disableMeta) {
          obj.meta.version = 0;
        }

        var key, constrUnique = this.constraints.unique;
        for (key in constrUnique) {
          if (hasOwnProperty.call(constrUnique, key)) {
            constrUnique[key].set(obj);
          }
        }
        this.idIndex.push(obj.$loki);
        this.data.push(obj);

        var addedPos = this.data.length - 1;
        var dvlen = this.DynamicViews.length;
        for (var i = 0; i < dvlen; i++) {
          this.DynamicViews[i].evaluateDocument(addedPos, true);
        }

        if (this.adaptiveBinaryIndices) {
          var bIndices = this.binaryIndices;
          for (key in bIndices) {
            this.adaptiveBinaryIndexInsert(addedPos, key);
          }
        }
        else {
          this.flagBinaryIndexesDirty();
        }

        this.commit();
        this.dirty = true; // for autosave scenarios

        return (this.cloneObjects) ? (clone(obj, this.cloneMethod)) : (obj);
      } catch (err) {
        this.rollback();
        this.console.error(err.message);
        this.emit('error', err);
        throw (err); // re-throw error so user does not think it succeeded
      }
    };

    /**
     * Applies a filter function and passes all results to an update function.
     *
     * @param {function} filterFunction - filter function whose results will execute update
     * @param {function} updateFunction - update function to run against filtered documents
     * @memberof Collection
     */
    Collection.prototype.updateWhere = function(filterFunction, updateFunction) {
      var results = this.where(filterFunction),
        i = 0,
        obj;
      try {
        for (i; i < results.length; i++) {
          obj = updateFunction(results[i]);
          this.update(obj);
        }

      } catch (err) {
        this.rollback();
        this.console.error(err.message);
      }
    };

    /**
     * Remove all documents matching supplied filter function.
     * For 'mongo-like' querying you should migrate to [findAndRemove()]{@link Collection#findAndRemove}.
     * @param {function|object} query - query object to filter on
     * @memberof Collection
     */
    Collection.prototype.removeWhere = function (query) {
      var list;
      if (typeof query === 'function') {
        list = this.data.filter(query);
        this.remove(list);
      } else {
        this.chain().find(query).remove();
      }
    };

    Collection.prototype.removeDataOnly = function () {
      this.remove(this.data.slice());
    };

    /**
     * Internal method to remove a batch of documents from the collection.
     * @param {number[]} positions - data/idIndex positions to remove
     */
    Collection.prototype.removeBatchByPositions = function(positions) {
      var len = positions.length;
      var xo = {};
      var dlen, didx, idx;
      var bic=Object.keys(this.binaryIndices).length;
      var adaptiveOverride = this.adaptiveBinaryIndices && Object.keys(this.binaryIndices).length > 0;

      try {
        this.startTransaction();
        for(idx=0; idx < len; idx++) {
          xo[this.idIndex[positions[idx]]] = true;
        }
        dlen = this.DynamicViews.length;
        if ((dlen > 0) || (bic > 0)) {
          if (dlen > 0) {
            for (didx = 0; didx < dlen; didx++) {
              this.DynamicViews[didx].removeDocument(positions);
            }
          }
          if (this.adaptiveBinaryIndices && !adaptiveOverride) {
            var key, bIndices = this.binaryIndices;

            for (key in bIndices) {
              this.adaptiveBinaryIndexRemove(positions, key);
            }
          }
          else {
            this.flagBinaryIndexesDirty();
          }
        }
        if (!this.disableChangesApi || this.events.delete.length > 1) {
          for(idx=0; idx < len; idx++) {
            this.emit('delete', this.data[positions[idx]]);
          }
        }
        this.data = this.data.filter(function(obj) {
          return !xo[obj.$loki];
        });
        this.idIndex = this.idIndex.filter(function(id) {
            return !xo[id];
        });

        if (this.adaptiveBinaryIndices && adaptiveOverride) {
          this.adaptiveBinaryIndices = false;
          this.ensureAllIndexes(true);
          this.adaptiveBinaryIndices = true;
        }

        this.commit();
        this.dirty = true;
      } 
      catch (err) {
        this.rollback();
        if (adaptiveOverride) {
          this.adaptiveBinaryIndices = true;
        }
        this.console.error(err.message);
        this.emit('error', err);
        return null;
      }      
    };

    /**
     *  Internal method called by remove()
     * @param {object[]|number[]} batch - array of documents or $loki ids to remove
     */
    Collection.prototype.removeBatch = function(batch) {
      var len = batch.length, 
        dlen=this.data.length, 
        idx;
      var xlt = {};
      var posx = [];
      for (idx=0; idx < dlen; idx++) {
        xlt[this.data[idx].$loki] = idx;
      }
      for (idx=0; idx < len; idx++) {
        if (typeof(batch[idx]) === 'object') {
          posx.push(xlt[batch[idx].$loki]);
        }
        else {
          posx.push(xlt[batch[idx]]);
        }
      }

      this.removeBatchByPositions(posx);
    };

    /**
     * Remove a document from the collection
     * @param {object} doc - document to remove from collection
     * @memberof Collection
     */
    Collection.prototype.remove = function (doc) {
      if (typeof doc === 'number') {
        doc = this.get(doc);
      }

      if ('object' !== typeof doc) {
        throw new Error('Parameter is not an object');
      }
      if (Array.isArray(doc)) {
        this.removeBatch(doc);
        return;
      }

      if (!hasOwnProperty.call(doc, '$loki')) {
        throw new Error('Object is not a document stored in the collection');
      }

      try {
        this.startTransaction();
        var arr = this.get(doc.$loki, true),
          position = arr[1];
        var self = this;
        Object.keys(this.constraints.unique).forEach(function (key) {
          if (doc[key] !== null && typeof doc[key] !== 'undefined') {
            self.constraints.unique[key].remove(doc[key]);
          }
        });
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].removeDocument(position);
        }

        if (this.adaptiveBinaryIndices) {
          var key, bIndices = this.binaryIndices;
          for (key in bIndices) {
            this.adaptiveBinaryIndexRemove(position, key);
          }
        }
        else {
          this.flagBinaryIndexesDirty();
        }

        this.data.splice(position, 1);
        this.removeAutoUpdateObserver(doc);
        this.idIndex.splice(position, 1);

        this.commit();
        this.dirty = true; // for autosave scenarios
        this.emit('delete', arr[0]);
        delete doc.$loki;
        delete doc.meta;
        return doc;

      } catch (err) {
        this.rollback();
        this.console.error(err.message);
        this.emit('error', err);
        return null;
      }
    };

    /*---------------------+
    | Finding methods     |
    +----------------------*/

    /**
     * Get by Id - faster than other methods because of the searching algorithm
     * @param {int} id - $loki id of document you want to retrieve
     * @param {boolean} returnPosition - if 'true' we will return [object, position]
     * @returns {(object|array|null)} Object reference if document was found, null if not,
     *     or an array if 'returnPosition' was passed.
     * @memberof Collection
     */
    Collection.prototype.get = function (id, returnPosition) {
      var retpos = returnPosition || false,
        data = this.idIndex,
        max = data.length - 1,
        min = 0,
        mid = (min + max) >> 1;

      id = typeof id === 'number' ? id : parseInt(id, 10);

      if (isNaN(id)) {
        throw new TypeError('Passed id is not an integer');
      }

      while (data[min] < data[max]) {
        mid = (min + max) >> 1;

        if (data[mid] < id) {
          min = mid + 1;
        } else {
          max = mid;
        }
      }

      if (max === min && data[min] === id) {
        if (retpos) {
          return [this.data[min], min];
        }
        return this.data[min];
      }
      return null;

    };

    /**
     * Perform binary range lookup for the data[dataPosition][binaryIndexName] property value
     *    Since multiple documents may contain the same value (which the index is sorted on),
     *    we hone in on range and then linear scan range to find exact index array position.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.getBinaryIndexPosition = function(dataPosition, binaryIndexName) {
      var val = this.data[dataPosition][binaryIndexName];
      var index = this.binaryIndices[binaryIndexName].values;
      var range = this.calculateRange("$eq", binaryIndexName, val);

      if (range[0] === 0 && range[1] === -1) {
        return null;
      }

      var min = range[0];
      var max = range[1];
      for(var idx = min; idx <= max; idx++) {
        if (index[idx] === dataPosition) return idx;
      }
      return null;
    };

    /**
     * Adaptively insert a selected item to the index.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.adaptiveBinaryIndexInsert = function(dataPosition, binaryIndexName) {
      var index = this.binaryIndices[binaryIndexName].values;
      var val = this.data[dataPosition][binaryIndexName];
      if (this.serializableIndices === true && val instanceof Date) {
        this.data[dataPosition][binaryIndexName] = val.getTime();
        val = this.data[dataPosition][binaryIndexName];
      }

      var idxPos = (index.length === 0)?0:this.calculateRangeStart(binaryIndexName, val, true);
      this.binaryIndices[binaryIndexName].values.splice(idxPos, 0, dataPosition);
    };

    /**
     * Adaptively update a selected item within an index.
     * @param {int} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.adaptiveBinaryIndexUpdate = function(dataPosition, binaryIndexName) {
      var idxPos,
        index = this.binaryIndices[binaryIndexName].values,
        len=index.length;

      for(idxPos=0; idxPos < len; idxPos++) {
        if (index[idxPos] === dataPosition) break;
      }
      this.binaryIndices[binaryIndexName].values.splice(idxPos, 1);
      this.adaptiveBinaryIndexInsert(dataPosition, binaryIndexName);
    };

    /**
     * Adaptively remove a selected item from the index.
     * @param {number|number[]} dataPosition : coll.data array index/position
     * @param {string} binaryIndexName : index to search for dataPosition in
     */
    Collection.prototype.adaptiveBinaryIndexRemove = function(dataPosition, binaryIndexName, removedFromIndexOnly) {
      var bi = this.binaryIndices[binaryIndexName];
      var len, idx, rmidx, rmlen, rxo = {};
      var curr, shift, idxPos;

      if (Array.isArray(dataPosition)) {
        rmlen = dataPosition.length;
        if (rmlen === 1) {
          dataPosition = dataPosition[0];
        }
        else {
          for(rmidx=0;rmidx<rmlen; rmidx++) {
            rxo[dataPosition[rmidx]] = true;
          }
          bi.values = bi.values.filter(function(di) { return !rxo[di]; });
          if (removedFromIndexOnly === true) {
            return;
          }
    
          var sortedPositions = dataPosition.slice();
          sortedPositions.sort(function (a, b) { return a-b; });
          len = bi.values.length;
          for (idx=0; idx<len; idx++) {
            curr=bi.values[idx];
            shift=0;
            for(rmidx=0; rmidx<rmlen && curr > sortedPositions[rmidx]; rmidx++) {
                shift++;
            }
            bi.values[idx]-=shift;
          }
          return;
        }
      }

      idxPos = this.getBinaryIndexPosition(dataPosition, binaryIndexName);

      if (idxPos === null) {
        return null;
      }
      bi.values.splice(idxPos, 1);
      if (removedFromIndexOnly === true) {
        return;
      }
      len = bi.values.length;
      for (idx = 0; idx < len; idx++) {
        if (bi.values[idx] > dataPosition) {
          bi.values[idx]--;
        }
      }
    };

    /**
     * Internal method used for index maintenance and indexed searching.
     * Calculates the beginning of an index range for a given value.
     * For index maintainance (adaptive:true), we will return a valid index position to insert to.
     * For querying (adaptive:false/undefined), we will :
     *    return lower bound/index of range of that value (if found)
     *    return next lower index position if not found (hole)
     * If index is empty it is assumed to be handled at higher level, so
     * this method assumes there is at least 1 document in index.
     *
     * @param {string} prop - name of property which has binary index
     * @param {any} val - value to find within index
     * @param {bool?} adaptive - if true, we will return insert position
     */
    Collection.prototype.calculateRangeStart = function (prop, val, adaptive) {
      var rcd = this.data;
      var index = this.binaryIndices[prop].values;
      var min = 0;
      var max = index.length - 1;
      var mid = 0;

      if (index.length === 0) {
        return -1;
      }

      var minVal = rcd[index[min]][prop];
      var maxVal = rcd[index[max]][prop];
      while (min < max) {
        mid = (min + max) >> 1;

        if (Comparators.lt(rcd[index[mid]][prop], val, false)) {
          min = mid + 1;
        } else {
          max = mid;
        }
      }

      var lbound = min;
      if (Comparators.aeq(val, rcd[index[lbound]][prop])) {
        return lbound;
      }
      if (Comparators.lt(val, rcd[index[lbound]][prop], false)) {
        return adaptive?lbound:lbound-1;
      }
      return adaptive?lbound+1:lbound;
    };

    /**
     * Internal method used for indexed $between.  Given a prop (index name), and a value
     * (which may or may not yet exist) this will find the final position of that upper range value.
     */
    Collection.prototype.calculateRangeEnd = function (prop, val) {
      var rcd = this.data;
      var index = this.binaryIndices[prop].values;
      var min = 0;
      var max = index.length - 1;
      var mid = 0;

      if (index.length === 0) {
        return -1;
      }

      var minVal = rcd[index[min]][prop];
      var maxVal = rcd[index[max]][prop];
      while (min < max) {
        mid = (min + max) >> 1;

        if (Comparators.lt(val, rcd[index[mid]][prop], false)) {
          max = mid;
        } else {
          min = mid + 1;
        }
      }

      var ubound = max;
      if (Comparators.aeq(val, rcd[index[ubound]][prop])) {
        return ubound;
      }
      if (Comparators.gt(val, rcd[index[ubound]][prop], false)) {
        return ubound+1;
      }
      if (Comparators.aeq(val, rcd[index[ubound-1]][prop])) {
        return ubound-1;
      }
      return ubound;
    };

    /**
     * calculateRange() - Binary Search utility method to find range/segment of values matching criteria.
     *    this is used for collection.find() and first find filter of resultset/dynview
     *    slightly different than get() binary search in that get() hones in on 1 value,
     *    but we have to hone in on many (range)
     * @param {string} op - operation, such as $eq
     * @param {string} prop - name of property to calculate range for
     * @param {object} val - value to use for range calculation.
     * @returns {array} [start, end] index array positions
     */
    Collection.prototype.calculateRange = function (op, prop, val) {
      var rcd = this.data;
      var index = this.binaryIndices[prop].values;
      var min = 0;
      var max = index.length - 1;
      var mid = 0;
      var lbound, lval;
      var ubound, uval;
      if (rcd.length === 0) {
        return [0, -1];
      }

      var minVal = rcd[index[min]][prop];
      var maxVal = rcd[index[max]][prop];
      switch (op) {
      case '$eq':
      case '$aeq':
        if (Comparators.lt(val, minVal, false) || Comparators.gt(val, maxVal, false)) {
          return [0, -1];
        }
        break;
      case '$dteq':
        if (Comparators.lt(val, minVal, false) || Comparators.gt(val, maxVal, false)) {
          return [0, -1];
        }
        break;
      case '$gt':
        if (Comparators.gt(val, maxVal, true)) {
          return [0, -1];
        }
        if (Comparators.gt(minVal, val, false)) {
          return [min, max];
        }
        break;
      case '$gte':
        if (Comparators.gt(val, maxVal, false)) {
          return [0, -1];
        }
        if (Comparators.gt(minVal, val, true)) {
            return [min, max];
        }
        break;
      case '$lt':
        if (Comparators.lt(val, minVal, true)) {
          return [0, -1];
        }
        if (Comparators.lt(maxVal, val, false)) {
          return [min, max];
        }
        break;
      case '$lte':
        if (Comparators.lt(val, minVal, false)) {
          return [0, -1];
        }
        if (Comparators.lt(maxVal, val, true)) {
          return [min, max];
        }
        break;
      case '$between':
        if (Comparators.gt(val[0], maxVal, false)) {
          return [0, -1];
        }
        if (Comparators.lt(val[1], minVal, false)) {
          return [0, -1];
        }

        lbound = this.calculateRangeStart(prop, val[0]);
        ubound = this.calculateRangeEnd(prop, val[1]);

        if (lbound < 0) lbound++;
        if (ubound > max) ubound--;

        if (!Comparators.gt(rcd[index[lbound]][prop], val[0], true)) lbound++;
        if (!Comparators.lt(rcd[index[ubound]][prop], val[1], true)) ubound--;

        if (ubound < lbound) return [0, -1];

        return ([lbound, ubound]);
      case '$in':
        var idxset = [],
          segResult = [];
        for (var j = 0, len = val.length; j < len; j++) {
            var seg = this.calculateRange('$eq', prop, val[j]);

            for (var i = seg[0]; i <= seg[1]; i++) {
                if (idxset[i] === undefined) {
                    idxset[i] = true;
                    segResult.push(i);
                }
            }
        }
        return segResult;
      }
      switch (op) {
        case '$eq':
        case '$aeq':
        case '$dteq':
        case '$gte':
        case '$lt':
          lbound = this.calculateRangeStart(prop, val);
          lval = rcd[index[lbound]][prop];
          break;
        default: break;
      }
      switch (op) {
        case '$eq':
        case '$aeq':
        case '$dteq':
        case '$lte':
        case '$gt':
          ubound = this.calculateRangeEnd(prop, val);
          uval = rcd[index[ubound]][prop];
          break;
        default: break;
      }


      switch (op) {
      case '$eq':
      case '$aeq':
      case '$dteq':
        if (!Comparators.aeq(lval, val)) {
          return [0, -1];
        }

        return [lbound, ubound];

      case '$gt':
        if (!Comparators.aeq(rcd[index[ubound]][prop], val)) {
          return [ubound, max];
        }
        return [ubound+1, max];

      case '$gte':
        if (!Comparators.aeq(rcd[index[lbound]][prop], val)) {
          return [lbound+1, max];
        }
        return [lbound, max];

      case '$lt':
        if (!Comparators.aeq(rcd[index[lbound]][prop], val)) {
          return [min, lbound];
        }
        return [min, lbound-1];

      case '$lte':
        if (!Comparators.aeq(rcd[index[ubound]][prop], val)) {
          return [min, ubound-1];
        }
        return [min, ubound];

      default:
        return [0, rcd.length - 1];
      }
    };

    /**
     * Retrieve doc by Unique index
     * @param {string} field - name of uniquely indexed property to use when doing lookup
     * @param {value} value - unique value to search for
     * @returns {object} document matching the value passed
     * @memberof Collection
     */
    Collection.prototype.by = function (field, value) {
      var self;
      if (value === undefined) {
        self = this;
        return function (value) {
          return self.by(field, value);
        };
      }

      var result = this.constraints.unique[field].get(value);
      if (!this.cloneObjects) {
        return result;
      } else {
        return clone(result, this.cloneMethod);
      }
    };

    /**
     * Find one object by index property, by property equal to value
     * @param {object} query - query object used to perform search with
     * @returns {(object|null)} First matching document, or null if none
     * @memberof Collection
     */
    Collection.prototype.findOne = function (query) {
      query = query || {};
      var result = this.chain().find(query,true).data();

      if (Array.isArray(result) && result.length === 0) {
        return null;
      } else {
        if (!this.cloneObjects) {
          return result[0];
        } else {
          return clone(result[0], this.cloneMethod);
        }
      }
    };

    /**
     * Chain method, used for beginning a series of chained find() and/or view() operations
     * on a collection.
     *
     * @param {string|array=} transform - named transform or array of transform steps
     * @param {object=} parameters - Object containing properties representing parameters to substitute
     * @returns {Resultset} (this) resultset, or data array if any map or join functions where called
     * @memberof Collection
     */
    Collection.prototype.chain = function (transform, parameters) {
      var rs = new Resultset(this);

      if (typeof transform === 'undefined') {
        return rs;
      }

      return rs.transform(transform, parameters);
    };

    /**
     * Find method, api is similar to mongodb.
     * for more complex queries use [chain()]{@link Collection#chain} or [where()]{@link Collection#where}.
     * @example {@tutorial Query Examples}
     * @param {object} query - 'mongo-like' query object
     * @returns {array} Array of matching documents
     * @memberof Collection
     */
    Collection.prototype.find = function (query) {
      return this.chain().find(query).data();
    };

    /**
     * Find object by unindexed field by property equal to value,
     * simply iterates and returns the first element matching the query
     */
    Collection.prototype.findOneUnindexed = function (prop, value) {
      var i = this.data.length,
        doc;
      while (i--) {
        if (this.data[i][prop] === value) {
          doc = this.data[i];
          return doc;
        }
      }
      return null;
    };

    /**
     * Transaction methods
     */

    /** start the transation */
    Collection.prototype.startTransaction = function () {
      if (this.transactional) {
        this.cachedData = clone(this.data, this.cloneMethod);
        this.cachedIndex = this.idIndex;
        this.cachedBinaryIndex = this.binaryIndices;
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].startTransaction();
        }
      }
    };

    /** commit the transation */
    Collection.prototype.commit = function () {
      if (this.transactional) {
        this.cachedData = null;
        this.cachedIndex = null;
        this.cachedBinaryIndex = null;
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].commit();
        }
      }
    };

    /** roll back the transation */
    Collection.prototype.rollback = function () {
      if (this.transactional) {
        if (this.cachedData !== null && this.cachedIndex !== null) {
          this.data = this.cachedData;
          this.idIndex = this.cachedIndex;
          this.binaryIndices = this.cachedBinaryIndex;
        }
        for (var idx = 0; idx < this.DynamicViews.length; idx++) {
          this.DynamicViews[idx].rollback();
        }
      }
    };
    Collection.prototype.async = function (fun, callback) {
      setTimeout(function () {
        if (typeof fun === 'function') {
          fun();
          callback();
        } else {
          throw new TypeError('Argument passed for async execution is not a function');
        }
      }, 0);
    };

    /**
     * Query the collection by supplying a javascript filter function.
     * @example
     * var results = coll.where(function(obj) {
     *   return obj.legs === 8;
     * });
     *
     * @param {function} fun - filter function to run against all collection docs
     * @returns {array} all documents which pass your filter function
     * @memberof Collection
     */
    Collection.prototype.where = function (fun) {
      return this.chain().where(fun).data();
    };

    /**
     * Map Reduce operation
     *
     * @param {function} mapFunction - function to use as map function
     * @param {function} reduceFunction - function to use as reduce function
     * @returns {data} The result of your mapReduce operation
     * @memberof Collection
     */
    Collection.prototype.mapReduce = function (mapFunction, reduceFunction) {
      try {
        return reduceFunction(this.data.map(mapFunction));
      } catch (err) {
        throw err;
      }
    };

    /**
     * Join two collections on specified properties
     *
     * @param {array|Resultset|Collection} joinData - array of documents to 'join' to this collection
     * @param {string} leftJoinProp - property name in collection
     * @param {string} rightJoinProp - property name in joinData
     * @param {function=} mapFun - (Optional) map function to use
     * @param {object=} dataOptions - options to data() before input to your map function
     * @param {bool} dataOptions.removeMeta - allows removing meta before calling mapFun
     * @param {boolean} dataOptions.forceClones - forcing the return of cloned objects to your map object
     * @param {string} dataOptions.forceCloneMethod - Allows overriding the default or collection specified cloning method.
     * @returns {Resultset} Result of the mapping operation
     * @memberof Collection
     */
    Collection.prototype.eqJoin = function (joinData, leftJoinProp, rightJoinProp, mapFun, dataOptions) {
      return new Resultset(this).eqJoin(joinData, leftJoinProp, rightJoinProp, mapFun, dataOptions);
    };

    /* ------ STAGING API -------- */
    /**
     * stages: a map of uniquely identified 'stages', which hold copies of objects to be
     * manipulated without affecting the data in the original collection
     */
    Collection.prototype.stages = {};

    /**
     * (Staging API) create a stage and/or retrieve it
     * @memberof Collection
     */
    Collection.prototype.getStage = function (name) {
      if (!this.stages[name]) {
        this.stages[name] = {};
      }
      return this.stages[name];
    };
    /**
     * a collection of objects recording the changes applied through a commmitStage
     */
    Collection.prototype.commitLog = [];

    /**
     * (Staging API) create a copy of an object and insert it into a stage
     * @memberof Collection
     */
    Collection.prototype.stage = function (stageName, obj) {
      var copy = JSON.parse(JSON.stringify(obj));
      this.getStage(stageName)[obj.$loki] = copy;
      return copy;
    };

    /**
     * (Staging API) re-attach all objects to the original collection, so indexes and views can be rebuilt
     * then create a message to be inserted in the commitlog
     * @param {string} stageName - name of stage
     * @param {string} message
     * @memberof Collection
     */
    Collection.prototype.commitStage = function (stageName, message) {
      var stage = this.getStage(stageName),
        prop,
        timestamp = new Date().getTime();

      for (prop in stage) {

        this.update(stage[prop]);
        this.commitLog.push({
          timestamp: timestamp,
          message: message,
          data: JSON.parse(JSON.stringify(stage[prop]))
        });
      }
      this.stages[stageName] = {};
    };

    Collection.prototype.no_op = function () {
      return;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.extract = function (field) {
      var i = 0,
        len = this.data.length,
        isDotNotation = isDeepProperty(field),
        result = [];
      for (i; i < len; i += 1) {
        result.push(deepProperty(this.data[i], field, isDotNotation));
      }
      return result;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.max = function (field) {
      return Math.max.apply(null, this.extract(field));
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.min = function (field) {
      return Math.min.apply(null, this.extract(field));
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.maxRecord = function (field) {
      var i = 0,
        len = this.data.length,
        deep = isDeepProperty(field),
        result = {
          index: 0,
          value: undefined
        },
        max;

      for (i; i < len; i += 1) {
        if (max !== undefined) {
          if (max < deepProperty(this.data[i], field, deep)) {
            max = deepProperty(this.data[i], field, deep);
            result.index = this.data[i].$loki;
          }
        } else {
          max = deepProperty(this.data[i], field, deep);
          result.index = this.data[i].$loki;
        }
      }
      result.value = max;
      return result;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.minRecord = function (field) {
      var i = 0,
        len = this.data.length,
        deep = isDeepProperty(field),
        result = {
          index: 0,
          value: undefined
        },
        min;

      for (i; i < len; i += 1) {
        if (min !== undefined) {
          if (min > deepProperty(this.data[i], field, deep)) {
            min = deepProperty(this.data[i], field, deep);
            result.index = this.data[i].$loki;
          }
        } else {
          min = deepProperty(this.data[i], field, deep);
          result.index = this.data[i].$loki;
        }
      }
      result.value = min;
      return result;
    };

    /**
     * @memberof Collection
     */
    Collection.prototype.extractNumerical = function (field) {
      return this.extract(field).map(parseBase10).filter(Number).filter(function (n) {
        return !(isNaN(n));
      });
    };

    /**
     * Calculates the average numerical value of a property
     *
     * @param {string} field - name of property in docs to average
     * @returns {number} average of property in all docs in the collection
     * @memberof Collection
     */
    Collection.prototype.avg = function (field) {
      return average(this.extractNumerical(field));
    };

    /**
     * Calculate standard deviation of a field
     * @memberof Collection
     * @param {string} field
     */
    Collection.prototype.stdDev = function (field) {
      return standardDeviation(this.extractNumerical(field));
    };

    /**
     * @memberof Collection
     * @param {string} field
     */
    Collection.prototype.mode = function (field) {
      var dict = {},
        data = this.extract(field);
      data.forEach(function (obj) {
        if (dict[obj]) {
          dict[obj] += 1;
        } else {
          dict[obj] = 1;
        }
      });
      var max,
        prop, mode;
      for (prop in dict) {
        if (max) {
          if (max < dict[prop]) {
            mode = prop;
          }
        } else {
          mode = prop;
          max = dict[prop];
        }
      }
      return mode;
    };

    /**
     * @memberof Collection
     * @param {string} field - property name
     */
    Collection.prototype.median = function (field) {
      var values = this.extractNumerical(field);
      values.sort(sub);

      var half = Math.floor(values.length / 2);

      if (values.length % 2) {
        return values[half];
      } else {
        return (values[half - 1] + values[half]) / 2.0;
      }
    };

    /**
     * General utils, including statistical functions
     */
    function isDeepProperty(field) {
      return field.indexOf('.') !== -1;
    }

    function parseBase10(num) {
      return parseFloat(num, 10);
    }

    function isNotUndefined(obj) {
      return obj !== undefined;
    }

    function add(a, b) {
      return a + b;
    }

    function sub(a, b) {
      return a - b;
    }

    function median(values) {
      values.sort(sub);
      var half = Math.floor(values.length / 2);
      return (values.length % 2) ? values[half] : ((values[half - 1] + values[half]) / 2.0);
    }

    function average(array) {
      return (array.reduce(add, 0)) / array.length;
    }

    function standardDeviation(values) {
      var avg = average(values);
      var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      return stdDev;
    }

    function deepProperty(obj, property, isDeep) {
      if (isDeep === false) {
        return obj[property];
      }
      var pieces = property.split('.'),
        root = obj;
      while (pieces.length > 0) {
        root = root[pieces.shift()];
      }
      return root;
    }

    function binarySearch(array, item, fun) {
      var lo = 0,
        hi = array.length,
        compared,
        mid;
      while (lo < hi) {
        mid = (lo + hi) >> 1;
        compared = fun.apply(null, [item, array[mid]]);
        if (compared === 0) {
          return {
            found: true,
            index: mid
          };
        } else if (compared < 0) {
          hi = mid;
        } else {
          lo = mid + 1;
        }
      }
      return {
        found: false,
        index: hi
      };
    }

    function BSonSort(fun) {
      return function (array, item) {
        return binarySearch(array, item, fun);
      };
    }

    function KeyValueStore() {}

    KeyValueStore.prototype = {
      keys: [],
      values: [],
      sort: function (a, b) {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
      },
      setSort: function (fun) {
        this.bs = new BSonSort(fun);
      },
      bs: function () {
        return new BSonSort(this.sort);
      },
      set: function (key, value) {
        var pos = this.bs(this.keys, key);
        if (pos.found) {
          this.values[pos.index] = value;
        } else {
          this.keys.splice(pos.index, 0, key);
          this.values.splice(pos.index, 0, value);
        }
      },
      get: function (key) {
        return this.values[binarySearch(this.keys, key, this.sort).index];
      }
    };

    function UniqueIndex(uniqueField) {
      this.field = uniqueField;
      this.keyMap = {};
      this.lokiMap = {};
    }
    UniqueIndex.prototype.keyMap = {};
    UniqueIndex.prototype.lokiMap = {};
    UniqueIndex.prototype.set = function (obj) {
      var fieldValue = obj[this.field];
      if (fieldValue !== null && typeof (fieldValue) !== 'undefined') {
        if (this.keyMap[fieldValue]) {
          throw new Error('Duplicate key for property ' + this.field + ': ' + fieldValue);
        } else {
          this.keyMap[fieldValue] = obj;
          this.lokiMap[obj.$loki] = fieldValue;
        }
      }
    };
    UniqueIndex.prototype.get = function (key) {
      return this.keyMap[key];
    };

    UniqueIndex.prototype.byId = function (id) {
      return this.keyMap[this.lokiMap[id]];
    };
    /**
     * Updates a document's unique index given an updated object.
     * @param  {Object} obj Original document object
     * @param  {Object} doc New document object (likely the same as obj)
     */
    UniqueIndex.prototype.update = function (obj, doc) {
      if (this.lokiMap[obj.$loki] !== doc[this.field]) {
        var old = this.lokiMap[obj.$loki];
        this.set(doc);
        this.keyMap[old] = undefined;
      } else {
        this.keyMap[obj[this.field]] = doc;
      }
    };
    UniqueIndex.prototype.remove = function (key) {
      var obj = this.keyMap[key];
      if (obj !== null && typeof obj !== 'undefined') {
        this.keyMap[key] = undefined;
        this.lokiMap[obj.$loki] = undefined;
      } else {
        throw new Error('Key is not in unique index: ' + this.field);
      }
    };
    UniqueIndex.prototype.clear = function () {
      this.keyMap = {};
      this.lokiMap = {};
    };

    function ExactIndex(exactField) {
      this.index = {};
      this.field = exactField;
    }
    ExactIndex.prototype = {
      set: function add(key, val) {
        if (this.index[key]) {
          this.index[key].push(val);
        } else {
          this.index[key] = [val];
        }
      },
      remove: function remove(key, val) {
        var idxSet = this.index[key];
        for (var i in idxSet) {
          if (idxSet[i] == val) {
            idxSet.splice(i, 1);
          }
        }
        if (idxSet.length < 1) {
          this.index[key] = undefined;
        }
      },
      get: function get(key) {
        return this.index[key];
      },
      clear: function clear(key) {
        this.index = {};
      }
    };

    function SortedIndex(sortedField) {
      this.field = sortedField;
    }

    SortedIndex.prototype = {
      keys: [],
      values: [],
      sort: function (a, b) {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
      },
      bs: function () {
        return new BSonSort(this.sort);
      },
      setSort: function (fun) {
        this.bs = new BSonSort(fun);
      },
      set: function (key, value) {
        var pos = binarySearch(this.keys, key, this.sort);
        if (pos.found) {
          this.values[pos.index].push(value);
        } else {
          this.keys.splice(pos.index, 0, key);
          this.values.splice(pos.index, 0, [value]);
        }
      },
      get: function (key) {
        var bsr = binarySearch(this.keys, key, this.sort);
        if (bsr.found) {
          return this.values[bsr.index];
        } else {
          return [];
        }
      },
      getLt: function (key) {
        var bsr = binarySearch(this.keys, key, this.sort);
        var pos = bsr.index;
        if (bsr.found) pos--;
        return this.getAll(key, 0, pos);
      },
      getGt: function (key) {
        var bsr = binarySearch(this.keys, key, this.sort);
        var pos = bsr.index;
        if (bsr.found) pos++;
        return this.getAll(key, pos, this.keys.length);
      },
      getAll: function (key, start, end) {
        var results = [];
        for (var i = start; i < end; i++) {
          results = results.concat(this.values[i]);
        }
        return results;
      },
      getPos: function (key) {
        return binarySearch(this.keys, key, this.sort);
      },
      remove: function (key, value) {
        var pos = binarySearch(this.keys, key, this.sort).index;
        var idxSet = this.values[pos];
        for (var i in idxSet) {
          if (idxSet[i] == value) idxSet.splice(i, 1);
        }
        if (idxSet.length < 1) {
          this.keys.splice(pos, 1);
          this.values.splice(pos, 1);
        }
      },
      clear: function () {
        this.keys = [];
        this.values = [];
      }
    };


    Loki.LokiOps = LokiOps;
    Loki.Collection = Collection;
    Loki.KeyValueStore = KeyValueStore;
    Loki.LokiMemoryAdapter = LokiMemoryAdapter;
    Loki.LokiPartitioningAdapter = LokiPartitioningAdapter;
    Loki.LokiLocalStorageAdapter = LokiLocalStorageAdapter;
    Loki.LokiFsAdapter = LokiFsAdapter;
    Loki.persistenceAdapters = {
      fs: LokiFsAdapter,
      localStorage: LokiLocalStorageAdapter
    };
    Loki.aeq = aeqHelper;
    Loki.lt = ltHelper;
    Loki.gt = gtHelper;
    Loki.Comparators = Comparators;
    return Loki;
  }());

}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(14), __webpack_require__(13)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var loki = __webpack_require__(8);
/**
 * Creates the offline database and return base API for external usage.
 * @ignore
 * @type {{getDB, getCollection, getCollectionByName, getCollections, save, close, flush}}
 */
var DB = /** @class */ (function () {
    function DB(name, $options, lokiStorageAdapter) {
        this.name = name;
        this.$options = $options;
        this.lokiStorageAdapter = lokiStorageAdapter;
        /**
         * Create internal JS offline persistence db.
         */
        this._db = null;
        this.options = {
            autosave: true,
            autosaveInterval: 500,
            autoload: true,
            adapter: null,
        };
        this.logger = new logger_1.Logger('DB');
        if (this.$options.off === true || this.$options.isTest === true) {
            this.options = {
                autosave: false,
                autosaveInterval: 60 * 1000 * 60 * 24 * 30 * 12,
                autoload: false,
                adapter: null,
            };
        }
        this.options.adapter = lokiStorageAdapter;
        var dbName = this.name || name || this.$options.offlineDBName || 'offline';
        this._db = new loki(dbName, this.options);
        this._db.loadDatabase();
    }
    /**
     * Wraps the way collection should be taken from the database. If given collection name does not exist
     * it will create it.
     *
     * @param name - the name of the collection to get, create
     * @returns {*}
     */
    DB.prototype.getCollectionByName = function (name) {
        var col = this._db.getCollection(name);
        if (!col) {
            var options = {
                clone: true,
                disableChangesApi: true,
                transactional: true,
            };
            col = this._db.addCollection(name, options);
        }
        return col;
    };
    /**
     * Return collection directly with promise. If collection does not exist it will be created.
     *
     * @param name - the name of the database collection
     * @returns {*}
     * @deprecated
     */
    DB.prototype.getCollection = function (name) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._db.loadDatabase({}, function () {
                var col = _this._db.getCollection(name);
                if (!col) {
                    var options = {
                        clone: true,
                        disableChangesApi: true,
                        transactional: true,
                    };
                    col = _this._db.addCollection(name);
                }
                resolve(col);
            });
        });
    };
    /**
     * In case developer explicitly wants to save the database, after db operation.
     */
    DB.prototype.saveDatabase = function () {
        this._db.save();
    };
    /**
     * Returns all registered collections from the offline database.
     */
    DB.prototype.getCollections = function () {
        return this._db.listCollections();
    };
    /**
     * Return the object to the internal created database
     * @returns {*}
     */
    DB.prototype.internalDB = function () {
        return this._db;
    };
    /**
     * Emits a close event with an optional callback. Note that this does not destroy the db or collections,
     * it's a utility method that can be called before closing the process or 'onbeforeunload' in a browser.
     *
     * @param callback - optional
     */
    DB.prototype.close = function (callback) {
        this._db.close(callback);
    };
    /**
     * This will go through all database collections and remove the data from them.
     */
    DB.prototype.flush = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var collections = _this.getCollections();
            for (var i = 0; i < collections.length; i++) {
                _this.getCollectionByName(collections[i].name).removeDataOnly();
            }
            resolve(true);
        });
    };
    return DB;
}());
exports.DB = DB;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 * @ignore
 */
var SyncResourceType = {
    item: 0,
    collection: 1,
    file: 2
};
exports.SyncResourceType = SyncResourceType;


/***/ }),
/* 11 */
/***/ (function(module, exports) {



/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
  Loki IndexedDb Adapter (need to include this script to use it)

  Console Usage can be used for management/diagnostic, here are a few examples :
  adapter.getDatabaseList(); // with no callback passed, this method will log results to console
  adapter.saveDatabase('UserDatabase', JSON.stringify(myDb));
  adapter.loadDatabase('UserDatabase'); // will log the serialized db to console
  adapter.deleteDatabase('UserDatabase');
*/

(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
  return (function() {

    /**
     * Loki persistence adapter class for indexedDb.
     *     This class fulfills abstract adapter interface which can be applied to other storage methods. 
     *     Utilizes the included LokiCatalog app/key/value database for actual database persistence.
     *     Indexeddb is highly async, but this adapter has been made 'console-friendly' as well.
     *     Anywhere a callback is omitted, it should return results (if applicable) to console.
     *     IndexedDb storage is provided per-domain, so we implement app/key/value database to 
     *     allow separate contexts for separate apps within a domain.
     *
     * @example
     * var idbAdapter = new LokiIndexedAdapter('finance');
     *
     * @constructor LokiIndexedAdapter
     *
     * @param {string} appname - (Optional) Application name context can be used to distinguish subdomains, 'loki' by default
     */
    function LokiIndexedAdapter(appname)
    {
      this.app = 'loki';

      if (typeof (appname) !== 'undefined')
      {
        this.app = appname;
      }
      this.catalog = null;

      if (!this.checkAvailability()) {
        throw new Error('indexedDB does not seem to be supported for your environment');
      }
    }

    /**
     * Used to check if adapter is available
     *
     * @returns {boolean} true if indexeddb is available, false if not.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.checkAvailability = function()
    {
      if (typeof indexedDB !== 'undefined' && indexedDB) return true;

      return false;
    };

    /**
     * Retrieves a serialized db string from the catalog.
     *
     * @example
     * // LOAD
     * var idbAdapter = new LokiIndexedAdapter('finance');
     * var db = new loki('test', { adapter: idbAdapter });
     *   db.loadDatabase(function(result) {
     *   console.log('done');
     * });
     *
     * @param {string} dbname - the name of the database to retrieve.
     * @param {function} callback - callback should accept string param containing serialized db string.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.loadDatabase = function(dbname, callback)
    {
      var appName = this.app;
      var adapter = this;
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.loadDatabase(dbname, callback);
        });

        return;
      }
      this.catalog.getAppKey(appName, dbname, function(result) {
        if (typeof (callback) === 'function') {
          if (result.id === 0) {
            callback(null);
            return;
          }
          callback(result.val);
        }
        else {
          console.log(result.val);
        }
      });
    };
    LokiIndexedAdapter.prototype.loadKey = LokiIndexedAdapter.prototype.loadDatabase;

    /**
     * Saves a serialized db to the catalog.
     *
     * @example
     * // SAVE : will save App/Key/Val as 'finance'/'test'/{serializedDb}
     * var idbAdapter = new LokiIndexedAdapter('finance');
     * var db = new loki('test', { adapter: idbAdapter });
     * var coll = db.addCollection('testColl');
     * coll.insert({test: 'val'});
     * db.saveDatabase();  // could pass callback if needed for async complete
     *
     * @param {string} dbname - the name to give the serialized database within the catalog.
     * @param {string} dbstring - the serialized db string to save.
     * @param {function} callback - (Optional) callback passed obj.success with true or false
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.saveDatabase = function(dbname, dbstring, callback)
    {
      var appName = this.app;
      var adapter = this;

      function saveCallback(result) {
        if (result && result.success === true) {
          callback(null);
        }
        else {
          callback(new Error("Error saving database"));
        }
      }
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;
          cat.setAppKey(appName, dbname, dbstring, saveCallback);
        });

        return;
      }
      this.catalog.setAppKey(appName, dbname, dbstring, saveCallback);
    };
    LokiIndexedAdapter.prototype.saveKey = LokiIndexedAdapter.prototype.saveDatabase;

    /**
     * Deletes a serialized db from the catalog.
     *
     * @example
     * // DELETE DATABASE
     * // delete 'finance'/'test' value from catalog
     * idbAdapter.deleteDatabase('test', function {
     *   // database deleted
     * });
     *
     * @param {string} dbname - the name of the database to delete from the catalog.
     * @param {function=} callback - (Optional) executed on database delete
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.deleteDatabase = function(dbname, callback)
    {
      var appName = this.app;
      var adapter = this;
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.deleteDatabase(dbname, callback);
        });

        return;
      }
      this.catalog.getAppKey(appName, dbname, function(result) {
        var id = result.id;

        if (id !== 0) {
          adapter.catalog.deleteAppKey(id, callback);
        } else if (typeof (callback) === 'function') {
          callback({ success: true });
        }
      });
    };
    LokiIndexedAdapter.prototype.deleteKey = LokiIndexedAdapter.prototype.deleteDatabase;

    /**
     * Removes all database partitions and pages with the base filename passed in.
     * This utility method does not (yet) guarantee async deletions will be completed before returning
     *
     * @param {string} dbname - the base filename which container, partitions, or pages are derived
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.deleteDatabasePartitions = function(dbname) {
      var self=this;
      this.getDatabaseList(function(result) {
        result.forEach(function(str) {
          if (str.startsWith(dbname)) {
            self.deleteDatabase(str);
          }
        });
      });
    };

    /**
     * Retrieves object array of catalog entries for current app.
     *
     * @example
     * idbAdapter.getDatabaseList(function(result) {
     *   // result is array of string names for that appcontext ('finance')
     *   result.forEach(function(str) {
     *     console.log(str);
     *   });
     * });
     *
     * @param {function} callback - should accept array of database names in the catalog for current app.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.getDatabaseList = function(callback)
    {
      var appName = this.app;
      var adapter = this;
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.getDatabaseList(callback);
        });

        return;
      }
      this.catalog.getAppKeys(appName, function(results) {
        var names = [];

        for(var idx = 0; idx < results.length; idx++) {
          names.push(results[idx].key);
        }

        if (typeof (callback) === 'function') {
          callback(names);
        }
        else {
          names.forEach(function(obj) {
            console.log(obj);
          });
        }
      });
    };
    LokiIndexedAdapter.prototype.getKeyList = LokiIndexedAdapter.prototype.getDatabaseList;

    /**
     * Allows retrieval of list of all keys in catalog along with size
     *
     * @param {function} callback - (Optional) callback to accept result array.
     * @memberof LokiIndexedAdapter
     */
    LokiIndexedAdapter.prototype.getCatalogSummary = function(callback)
    {
      var appName = this.app;
      var adapter = this;
      if (this.catalog === null || this.catalog.db === null) {
        this.catalog = new LokiCatalog(function(cat) {
          adapter.catalog = cat;

          adapter.getCatalogSummary(callback);
        });

        return;
      }
      this.catalog.getAllKeys(function(results) {
        var entries = [];
        var obj,
          size,
          oapp,
          okey,
          oval;

        for(var idx = 0; idx < results.length; idx++) {
          obj = results[idx];
          oapp = obj.app || '';
          okey = obj.key || '';
          oval = obj.val || '';
          size = oapp.length * 2 + okey.length * 2 + oval.length + 1;

          entries.push({ "app": obj.app, "key": obj.key, "size": size });
        }

        if (typeof (callback) === 'function') {
          callback(entries);
        }
        else {
          entries.forEach(function(obj) {
            console.log(obj);
          });
        }
      });
    };

    /**
     * LokiCatalog - underlying App/Key/Value catalog persistence
     *    This non-interface class implements the actual persistence.
     *    Used by the IndexedAdapter class.
     */
    function LokiCatalog(callback)
    {
      this.db = null;
      this.initializeLokiCatalog(callback);
    }

    LokiCatalog.prototype.initializeLokiCatalog = function(callback) {
      var openRequest = indexedDB.open('LokiCatalog', 1);
      var cat = this;
      openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
        if (thisDB.objectStoreNames.contains('LokiAKV')) {
          thisDB.deleteObjectStore('LokiAKV');
        }

        if(!thisDB.objectStoreNames.contains('LokiAKV')) {
          var objectStore = thisDB.createObjectStore('LokiAKV', { keyPath: 'id', autoIncrement:true });
          objectStore.createIndex('app', 'app', {unique:false});
          objectStore.createIndex('key', 'key', {unique:false});
          objectStore.createIndex('appkey', 'appkey', {unique:true});
        }
      };

      openRequest.onsuccess = function(e) {
        cat.db = e.target.result;

        if (typeof (callback) === 'function') callback(cat);
      };

      openRequest.onerror = function(e) {
        throw e;
      };
    };

    LokiCatalog.prototype.getAppKey = function(app, key, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var index = store.index('appkey');
      var appkey = app + "," + key;
      var request = index.get(appkey);

      request.onsuccess = (function(usercallback) {
        return function(e) {
          var lres = e.target.result;

          if (lres === null || typeof(lres) === 'undefined') {
            lres = {
              id: 0,
              success: false
            };
          }

          if (typeof(usercallback) === 'function') {
            usercallback(lres);
          }
          else {
            console.log(lres);
          }
        };
      })(callback);

      request.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback({ id: 0, success: false });
          }
          else {
            throw e;
          }
        };
      })(callback);
    };

    LokiCatalog.prototype.getAppKeyById = function (id, callback, data) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var request = store.get(id);

      request.onsuccess = (function(data, usercallback){
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback(e.target.result, data);
          }
          else {
            console.log(e.target.result);
          }
        };
      })(data, callback);
    };

    LokiCatalog.prototype.setAppKey = function (app, key, val, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readwrite');
      var store = transaction.objectStore('LokiAKV');
      var index = store.index('appkey');
      var appkey = app + "," + key;
      var request = index.get(appkey);
      request.onsuccess = function(e) {
        var res = e.target.result;

        if (res === null || res === undefined) {
          res = {
            app:app,
            key:key,
            appkey: app + ',' + key,
            val:val
          };
        }
        else {
          res.val = val;
        }

        var requestPut = store.put(res);

        requestPut.onerror = (function(usercallback) {
          return function(e) {
            if (typeof(usercallback) === 'function') {
              usercallback({ success: false });
            }
            else {
              console.error('LokiCatalog.setAppKey (set) onerror');
              console.error(request.error);
            }
          };

        })(callback);

        requestPut.onsuccess = (function(usercallback) {
          return function(e) {
            if (typeof(usercallback) === 'function') {
              usercallback({ success: true });
            }
          };
        })(callback);
      };

      request.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback({ success: false });
          }
          else {
            console.error('LokiCatalog.setAppKey (get) onerror');
            console.error(request.error);
          }
        };
      })(callback);
    };

    LokiCatalog.prototype.deleteAppKey = function (id, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readwrite');
      var store = transaction.objectStore('LokiAKV');
      var request = store.delete(id);

      request.onsuccess = (function(usercallback) {
        return function(evt) {
          if (typeof(usercallback) === 'function') usercallback({ success: true });
        };
      })(callback);

      request.onerror = (function(usercallback) {
        return function(evt) {
          if (typeof(usercallback) === 'function') {
            usercallback({ success: false });
          }
          else {
            console.error('LokiCatalog.deleteAppKey raised onerror');
            console.error(request.error);
          }
        };
      })(callback);
    };

    LokiCatalog.prototype.getAppKeys = function(app, callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var index = store.index('app');
      var singleKeyRange = IDBKeyRange.only(app);
      var cursor = index.openCursor(singleKeyRange);
      var localdata = [];

      cursor.onsuccess = (function(data, callback) {
        return function(e) {
          var cursor = e.target.result;
          if (cursor) {
            var currObject = cursor.value;

            data.push(currObject);

            cursor.continue();
          }
          else {
            if (typeof(callback) === 'function') {
              callback(data);
            }
            else {
              console.log(data);
            }
          }
        };
      })(localdata, callback);

      cursor.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') {
            usercallback(null);
          }
          else {
            console.error('LokiCatalog.getAppKeys raised onerror');
            console.error(e);
          }
        };
      })(callback);

    };
    LokiCatalog.prototype.getAllKeys = function (callback) {
      var transaction = this.db.transaction(['LokiAKV'], 'readonly');
      var store = transaction.objectStore('LokiAKV');
      var cursor = store.openCursor();

      var localdata = [];

      cursor.onsuccess = (function(data, callback) {
        return function(e) {
          var cursor = e.target.result;
          if (cursor) {
            var currObject = cursor.value;

            data.push(currObject);

            cursor.continue();
          }
          else {
            if (typeof(callback) === 'function') {
              callback(data);
            }
            else {
              console.log(data);
            }
          }
        };
      })(localdata, callback);

      cursor.onerror = (function(usercallback) {
        return function(e) {
          if (typeof(usercallback) === 'function') usercallback(null);
        };
      })(callback);

    };

    return LokiIndexedAdapter;

  }());
}));


/***/ }),
/* 13 */
/***/ (function(module, exports) {
var process = module.exports = {};

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var g;
g = (function() {
	return this;
})();

try {
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	if (typeof window === "object") g = window;
}

module.exports = g;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*
* @authors Lyudmil Pelov
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var request_handler_1 = __webpack_require__(6);
/**
 * This module provide the MCS Persistent capabilities
 * @ignore
 * @type {{}}
 */
var McsRequestHandler = /** @class */ (function (_super) {
    __extends(McsRequestHandler, _super);
    function McsRequestHandler(options, common, utils, lokiStorageAdapter) {
        return _super.call(this, 'mcs-request', options, common, utils, lokiStorageAdapter) || this;
    }
    McsRequestHandler.prototype.buildResponseObject = function (obj) {
        return obj;
    };
    McsRequestHandler.prototype.getResponsePayload = function (response) {
        return response.data;
    };
    McsRequestHandler.prototype.getModuleName = function () {
        return 'MCS';
    };
    /**
     * Check to see if this was also MCS payload!
     *
     * @param request
     * @returns {boolean}
     */
    McsRequestHandler.prototype.isPersistentGetRequest = function (request) {
        _super.prototype.isPersistentGetRequest.call(this, request);
        var resourceTypeHeader = McsRequestHandler.HEADER_RESOURCE_TYPE in request ||
            request.headers[McsRequestHandler.HEADER_RESOURCE_TYPE];
        if (resourceTypeHeader === 'collection') {
            if (this.$common.isEmpty(request.data)) {
                throw new Error('cannot proceed with empty payload');
            }
            if (!('items' in request.data)) {
                throw new Error('items is not in the payload returned from MCS, probably not Sync Custom Code');
            }
            if (!('uris' in request.data)) {
                throw new Error('url is not in the payload returned from MCS, probably not Sync Custom Code');
            }
            if (!('etags' in request.data)) {
                throw new Error('etags is not in the payload returned from MCS, probably not Sync Custom Code');
            }
        }
        else if (resourceTypeHeader !== 'item') {
            throw new Error('oracle-mobile-sync-resource-type is not in the headers returned from MCS, ' +
                'probably not Sync Custom Code');
        }
        return true;
    };
    /**
     * Transform the payload and add it into the $db!
     *
     * NOTE: Such a transformations could hold a lot of resources!
     *
     * @param collection
     * @param payload
     * @returns {*}
     */
    McsRequestHandler.prototype.handleMcsGetCollectionPayload = function (payload, collection) {
        var items = payload.items;
        var now = Date.now();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item[McsRequestHandler.URI_KEY] = this.normalizeURI(payload.uris[i]);
            item[McsRequestHandler.ETAG_KEY] = payload.etags[i];
            var itemUri = item[McsRequestHandler.URI_KEY];
            var result = this.collectionFindOneByUri(collection, itemUri);
            if (result) {
                this.$common.extendOwn(result, item);
                collection.update(result);
            }
            else {
                collection.insert(item);
            }
        }
        collection.removeWhere(function (dbObj) {
            return (dbObj.meta.updated || dbObj.meta.created) < now;
        });
        return collection.find();
    };
    /**
     * Handle item payload from the MCS
     *
     * @param collection
     * @param payload
     * @param uri
     * @returns {*}
     */
    McsRequestHandler.prototype.handleMcsGetItemPayload = function (collection, payload, uri) {
        var result = this.collectionFindOneByUri(collection, uri);
        if (result) {
            var item = payload;
            this.$common.extendOwn(result, item);
            return collection.update(result);
        }
        else {
            var item = payload;
            item[McsRequestHandler.URI_KEY] = uri;
            return collection.insert(item);
        }
    };
    /**
     * If nothing in the payload check get what is in the offline $db!
     * @param response - response is always array of objects!
     */
    McsRequestHandler.prototype.handleGet = function (response) {
        var persistentPath = this.$options.isPersistentUrl(response.url);
        if (persistentPath === false) {
            throw new Error('Persistence.handleMcsGet()-> URI was not configured for persistence:' + response.url);
        }
        var collection = this.$db.getCollectionByName(persistentPath.root);
        if (this.$common.isEmpty(persistentPath.params)) {
            var result = collection.find();
            var data = {
                items: [],
                uris: [],
                etags: [],
            };
            for (var idx in result) {
                if (result[idx].hasOwnProperty(McsRequestHandler.URI_KEY)) {
                    data.uris.push(result[idx][McsRequestHandler.URI_KEY]);
                    delete result[idx][McsRequestHandler.URI_KEY];
                }
                if (result[idx].hasOwnProperty(McsRequestHandler.ETAG_KEY)) {
                    data.etags.push(result[idx][McsRequestHandler.ETAG_KEY]);
                    delete result[idx][McsRequestHandler.ETAG_KEY];
                }
                var cleanObject = this.$common.cleanObject(result[idx]);
                data.items.push(cleanObject);
            }
            return data;
        }
        var item = this.collectionFindOneByPersistentPath(collection, persistentPath);
        return this.$common.cleanObject(item);
    };
    McsRequestHandler.prototype.handleGetStore = function (response) {
        var persistentPath = this.$options.isPersistentUrl(response.url);
        if (persistentPath === false) {
            throw new Error('Persistence.handleMcsGetStore()-> URI was not configured for persistence:' + response.url);
        }
        var collection = this.$db.getCollectionByName(persistentPath.root);
        var payload = response.data;
        var resourceTypeHeader = McsRequestHandler.HEADER_RESOURCE_TYPE in response || response.headers[McsRequestHandler.HEADER_RESOURCE_TYPE];
        if (resourceTypeHeader === 'collection') {
            return this.handleMcsGetCollectionPayload(payload, collection);
        }
        else if (resourceTypeHeader === 'item') {
            return this.handleMcsGetItemPayload(collection, payload, persistentPath.path);
        }
        else if (resourceTypeHeader) {
            this.logger.error('unknown Oracle-Mobile-Sync-Resource-Type (%s)', resourceTypeHeader);
            throw new Error('unknown Oracle-Mobile-Sync-Resource-Type');
        }
        else {
            this.logger.error('this is not MCS response, unable to handle the payload, no MCS header was specified: ', response);
            throw new Error('this is not MCS response, unable to handle the payload, no MCS header was specified');
        }
    };
    /**
     * Currently posts supports only adding new objects into the root!
     *
     * @param response
     * @param force
     */
    McsRequestHandler.prototype.handlePost = function (response, force) {
        var persistentPath = this.$options.isPersistentUrl(response.url);
        if (persistentPath === false) {
            throw new Error('Persistence.handleMcsPost()-> URI was not configured for persistence:' + response.url);
        }
        var collection = this.$db.getCollectionByName(persistentPath.root);
        var payload = response.data;
        if (!this.$common.isEmpty(persistentPath.params)) {
            throw new Error('you can add new objects only against the root REST resource endpoint');
        }
        if (this.$common.isArray(payload)) {
            throw new Error('the payload cannot be array');
        }
        else if (this.$common.isObject(payload)
            && !this.$common.isNull(payload)
            && !this.$common.isFunction(payload)) {
            if (response.data && response.data[McsRequestHandler.URI_KEY]) {
                return this.updatePayloadWithNewUri(collection, response);
            }
            else {
                var uri = null;
                if (response && response.headers && response.headers[McsRequestHandler.HEADER_LOCATION]) {
                    uri = this.$common.stringStartsWith(response.headers[McsRequestHandler.HEADER_LOCATION], '/') ?
                        response.headers[McsRequestHandler.HEADER_LOCATION] :
                        '/' + response.headers[McsRequestHandler.HEADER_LOCATION];
                }
                var result = null;
                if (uri) {
                    result = this.collectionFindOneByUri(collection, uri);
                }
                if (!result) {
                    payload[McsRequestHandler.ETAG_KEY] = '"0-1B2M2Y8AsgTpgAmY7PhCfg"'; // empty e-tag
                    result = collection.insert(payload);
                    this.markObjAsOfflineIfForced(result, force);
                }
                else {
                    this.$common.extendOwn(result, response.data);
                }
                if (!uri) {
                    var key = (persistentPath.tokens.length > 0 && /^\w+$/.test(persistentPath.tokens[0].name)) ? persistentPath.tokens[0].name : null;
                    var value = null;
                    if (key) {
                        value = (response.data.hasOwnProperty(key)) ? response.data[key] : this.$common.getUID();
                    }
                    uri = (value === null) ? persistentPath.root + '/' + this.$common.getUID() : persistentPath.root + '/' + value;
                }
                result[McsRequestHandler.URI_KEY] = uri;
                return collection.update(result);
            }
        }
        throw new Error('don\'t know what to do with the payload');
    };
    McsRequestHandler.prototype.updatePayloadWithNewUri = function (collection, response) {
        var uri = response.data[McsRequestHandler.URI_KEY];
        var result = this.collectionFindOneByUri(collection, uri);
        if (result) {
            this.$common.extendOwn(result, response.data);
            result[McsRequestHandler.URI_KEY] = this.normalizeURI(response.headers[McsRequestHandler.HEADER_LOCATION]);
            return collection.update(result);
        }
        else {
            throw new Error("the payload was not found in collection:" + uri);
        }
    };
    /**
     * Currently posts supports only adding new objects into the root!
     *
     * @param response
     * @param force
     */
    McsRequestHandler.prototype.handlePut = function (response, force) {
        var persistentPath = this.$options.isPersistentUrl(response.url);
        if (persistentPath === false) {
            throw new Error('Persistence.handleMcsPut()-> URI was not configured for persistence:' + response.url);
        }
        var collection = this.$db.getCollectionByName(persistentPath.root);
        var payload = response.data;
        if (!this.$common.isEmpty(persistentPath.params)) {
            if (this.$common.isArray(payload)) {
                throw new Error('the payload cannot be array');
            }
            else if (this.$common.isObject(payload) &&
                !this.$common.isNull(payload) &&
                !this.$common.isFunction(payload)) {
                var result = this.collectionFindOneByPersistentPath(collection, persistentPath);
                if (result) {
                    this.$common.extendOwn(result, payload);
                    this.markObjAsOfflineIfForced(result, force);
                    return collection.update(result);
                }
            }
        }
        throw new Error('you can execute update operations only against existing items in the offline database!');
    };
    /**
     * Find item in collection that ends with persistentPath.path
     * @param collection
     * @param persistentPath
     */
    McsRequestHandler.prototype.collectionFindOneByPersistentPath = function (collection, persistentPath) {
        var regexStr = persistentPath.path + "$";
        var query = {};
        query[McsRequestHandler.URI_KEY] = {
            $regex: new RegExp(regexStr)
        };
        return collection.findOne(query);
    };
    /**
     * Find item in collection by itm uri
     * @param collection
     * @param uri
     */
    McsRequestHandler.prototype.collectionFindOneByUri = function (collection, uri) {
        var query = {};
        query[McsRequestHandler.URI_KEY] = uri;
        return collection.findOne(query);
    };
    /**
     *
     * @param response
     * @returns {*}
     */
    McsRequestHandler.prototype.handleDelete = function (response) {
        var persistentPath = this.$options.isPersistentUrl(response.url);
        if (persistentPath === false) {
            throw new Error('Persistence.handleMcsDelete()-> URI was not configured for persistence:' + response.url);
        }
        var collection = this.$db.getCollectionByName(persistentPath.root);
        if (!this.$common.isEmpty(persistentPath.params)) {
            var item = this.collectionFindOneByPersistentPath(collection, persistentPath);
            if (item) {
                return collection.remove(item);
            }
            throw new Error("unable to find object with the given ID(" + persistentPath.path + ") in the database");
        }
    };
    McsRequestHandler.prototype.postSuccessOperations = function (obj) {
        if (obj.syncObj.method === 'POST') {
            var cpObj = this.$common.clone(obj);
            var parsed = this.$options.parseURL(cpObj.syncObj.url);
            var isPersistentUrl = this.$utils.isPersistUrl(parsed.path);
            if (isPersistentUrl === false) {
                this.logger.debug('sync post success operation exist');
                return obj;
            }
            var queryParams = this.$utils.extractKeyValuesFromUrl2(isPersistentUrl);
            var collection = this.$db.getCollectionByName(queryParams.root);
            var beforeSyncPayload = cpObj.syncObj.data;
            var response = cpObj.response;
            if (this.$common.isArray(beforeSyncPayload)) {
                this.logger.error('The payload cannot be array');
                return obj;
            }
            else if (this.$common.isObject(beforeSyncPayload)
                && !this.$common.isNull(beforeSyncPayload)
                && !this.$common.isFunction(beforeSyncPayload)) {
                if (response.data && response.data[McsRequestHandler.URI_KEY]) {
                    return this.updatePayloadWithNewUri(collection, response);
                }
                else {
                    var uri = null;
                    if (cpObj.headers) {
                        var headers = this.$utils.parseResponseHeaders(cpObj.headers);
                        if (headers[McsRequestHandler.HEADER_LOCATION]) {
                            var uriHeader = headers[McsRequestHandler.HEADER_LOCATION];
                            uri = this.normalizeURI(uriHeader);
                        }
                    }
                    var beforeSyncItemUri = beforeSyncPayload[McsRequestHandler.URI_KEY];
                    var result = this.collectionFindOneByUri(collection, beforeSyncItemUri);
                    if (!result) {
                        beforeSyncPayload[McsRequestHandler.ETAG_KEY] = '"0-1B2M2Y8AsgTpgAmY7PhCfg"'; // empty e-tag
                        result = collection.insert(beforeSyncPayload);
                    }
                    else {
                        this.$common.extendOwn(result, response.data);
                    }
                    if (!uri) {
                        var key = (isPersistentUrl.uri.tokens.length > 0 && /^\w+$/.test(isPersistentUrl.uri.tokens[0].name)) ? isPersistentUrl.uri.tokens[0].name : null;
                        var value = null;
                        if (key) {
                            value = (response.data.hasOwnProperty(key)) ? response.data[key] : this.$common.getUID();
                        }
                        uri = (value === null) ? isPersistentUrl.root + '/' + this.$common.getUID() : isPersistentUrl.root + '/' + value;
                    }
                    result[McsRequestHandler.URI_KEY] = uri;
                    return collection.update(result);
                }
            }
        }
        return obj;
    };
    McsRequestHandler.prototype.normalizeURI = function (uri) {
        return this.$common.stringStartsWith(uri, '/') || this.$common.stringStartsWith(uri, 'http') ? uri : '/' + uri;
    };
    McsRequestHandler.prototype.data = function (path) {
        function doData(path) {
            var persistentPath = this.$options.isPersistentUrl(path);
            if (!persistentPath) {
                throw new Error('Persistence.BaseModule.data() given URI not configured for persistence: ' + path);
            }
            return this.$db.getCollectionByName(persistentPath.root);
        }
        return new Promise(function (resolve) { return resolve(doData(path)); });
    };
    McsRequestHandler.prototype.router = function (request, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        return new Promise(function (resolve) {
            if (!_this.$common.isObject(request)) {
                console.error('Passed object is not defined request!', request);
                throw new Error('Passed object is not defined request!');
            }
            if (!request.hasOwnProperty('method')) {
                _this.logger.error('request.method was not provided!', request);
                throw new Error('request.method was not provided!');
            }
            var _request = _this.$common.clone(request);
            _request.method = _this.$utils._normalizeMethod(_request.method);
            if (!_this[_request.method]) {
                _this.logger.error('specified router is not implemented!');
                throw new Error('specified router is not implemented!');
            }
            var result = _this[_request.method](_request, force);
            resolve(result);
        });
    };
    McsRequestHandler.prototype.get = function (request) {
        var _this = this;
        var doGet = function (request) {
            _this.logger.info('get()');
            _this.isPersistentRequest(request);
            var _request = _this.$common.clone(request);
            if (!_request.hasOwnProperty('data') || _this.$common.isEmpty(_request.data)) {
                return _this.$common.clone(_this.handleGet(_request));
            }
            _this.isPersistentGetRequest(request);
            return _this.$common.clone(_this.handleGetStore(_request));
        };
        return new Promise(function (resolve) {
            resolve(doGet(request));
        });
    };
    McsRequestHandler.URI_KEY = '$mcs$mcsPersistenceURI';
    McsRequestHandler.ETAG_KEY = '$mcs$etag';
    McsRequestHandler.HEADER_LOCATION = 'location';
    McsRequestHandler.HEADER_RESOURCE_TYPE = 'oracle-mobile-sync-resource-type';
    return McsRequestHandler;
}(request_handler_1.RequestHandler));
exports.McsRequestHandler = McsRequestHandler;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for MobileObject, MobileCollection and MobileFile.
 * @abstract
 * @private
 */
var MobileResource = /** @class */ (function () {
    function MobileResource(endpoint, uri) {
        this.endpoint = endpoint;
        this.uri = uri;
    }
    MobileResource.prototype._getEndpoint = function () {
        return this.endpoint;
    };
    MobileResource.prototype._getMcsId = function () {
        return this.uri ? this.uri.substring(this.uri.lastIndexOf('/') + 1, this.uri.length) : null;
    };
    MobileResource.prototype._getMcsURI = function () {
        return this.uri;
    };
    return MobileResource;
}());
exports.MobileResource = MobileResource;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(0);
var StorageObject = /** @class */ (function () {
    /**
     * @classdesc Class that represents a storage object resource that can be used to store data.
     * This class constructor accessible by [mcs.StorageObject]{@link mcs.StorageObject} method.
     * @param storageCollection {StorageCollection}
     * @param json {Object}
     * @class
     * @global
     * @mcs
     */
    function StorageObject(storageCollection, json) {
        this.storageCollection = storageCollection;
        if (!!json) {
            this.id = json.id;
            this.name = json.name;
            this.contentLength = json.contentLength;
            this.contentType = json.contentType;
            this._eTag = json.eTag;
            this.createdBy = json.createdBy;
            this.createdOn = json.createdOn;
            this.modifiedBy = json.modifiedBy;
            this.modifiedOn = json.modifiedOn;
        }
    }
    /**
     * Get payload.
     * Returns the current StorageObject payload.
     * When contentType is json, this method returns JSON object, otherwise string.
     *
     * @function
     * @name StorageObject#getPayload
     * @return Current Storage object payload.
     * @mcs
     */
    StorageObject.prototype.getPayload = function () {
        if (this.contentType === types_1.ContentTypes.APPLICATION_JSON) {
            return JSON.parse(this._payload);
        }
        else {
            return this._payload;
        }
    };
    /**
     * Set payload.
     * Sets the payload for the StorageObject.
     *
     * @function
     * @name StorageObject#setPayload
     * @param payload The payload to be associated with StorageObject.
     * @mcs
     */
    StorageObject.prototype.setPayload = function (payload) {
        if (this.contentType === types_1.ContentTypes.APPLICATION_JSON && typeof payload === 'object') {
            this._payload = JSON.stringify(payload);
        }
        else {
            this._payload = payload;
        }
        this.contentLength = this._payload.length;
    };
    /**
     * Get storage collection.
     * Returns the current StorageCollection.
     *
     * @function
     * @name StorageObject#getstorageCollection
     * @return Current StorageCollection.
     * @mcs
     */
    StorageObject.prototype.getstorageCollection = function () {
        return this.storageCollection;
    };
    /**
     * Get storage.
     * Returns the current StorageObject.
     *
     * @function
     * @name StorageObject#getStorage
     * @return Current StorageObject.
     * @mcs
     */
    StorageObject.prototype.getStorage = function () {
        return this.storageCollection.getStorage();
    };
    /**
     * Load payload.
     * Loads a StorageObject's contents from an object.
     * @function
     * @name StorageObject#loadPayload
     * @param payload {Object} The object to load from.
     * @param contentType {String} The media-type to associate with the content.
     * @mcs
     */
    StorageObject.prototype.loadPayload = function (payload, contentType) {
        this.contentType = contentType;
        this.setPayload(payload);
    };
    /**
     * Set display name.
     * Sets a StorageObject's display name from an object.
     * @function
     * @name StorageObject#setDisplayName
     * @param name {Object} The object's name to be associated with the object.
     * @returns The object's name in UTC-8 ASCII format.\
     * @mcs
     */
    StorageObject.prototype.setDisplayName = function (name) {
        this.name = name;
    };
    /**
     * Get Display name.
     * Returns a StorageObject's display name from an object.
     *
     * @function
     * @name StorageObject#getDisplayName
     * @returns {String} object's name decoded if encoded into the MobileBackend.
     * @mcs
     */
    StorageObject.prototype.getDisplayName = function () {
        return this.name;
    };
    /**
     * Read payload.
     * Returns the contents of the StorageObject. May result in a download from the service if the contents were not
     * previously downloaded.
     * @function
     * @name StorageObject#readPayload
     * @param {String} objectType responseType for the XMLHttpRequest Object.
     * @return {Promise<StorageObject|NetworkResponse>}
     * @mcs
     */
    StorageObject.prototype.readPayload = function (objectType) {
        var _this = this;
        var payload = this.getPayload();
        if (!payload) {
            return this.storageCollection
                .loadObjectPayload(this.id, objectType)
                .then(function (response) {
                _this.contentType = response.headers[types_1.Headers.CONTENT_TYPE.toLowerCase()];
                _this.name = decodeURI(response.headers[types_1.Headers.ORACLE_MOBILE_NAME.toLowerCase()]);
                _this._eTag = response.headers[types_1.Headers.E_TAG.toLowerCase()];
                _this.createdBy = response.headers[types_1.Headers.ORACLE_MOBILE_CREATED_BY.toLowerCase()];
                _this.createdOn = response.headers[types_1.Headers.ORACLE_MOBILE_CREATED_ON.toLowerCase()];
                _this.modifiedBy = response.headers[types_1.Headers.ORACLE_MOBILE_MODIFIED_BY.toLowerCase()];
                _this.modifiedOn = response.headers[types_1.Headers.ORACLE_MOBILE_MODIFIED_ON.toLowerCase()];
                _this.setPayload(response.data);
                return _this;
            });
        }
        else {
            return Promise.resolve(this);
        }
    };
    return StorageObject;
}());
exports.StorageObject = StorageObject;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var AnalyticsEvent = /** @class */ (function () {
    /**
     * @classdesc Class that holds an analytics event.
     * This class constructor accessible by [mcs.AnalyticsEvent]{@link mcs.AnalyticsEvent} method.
     * @param {string} name - event name
     * @constructor
     * @class
     * @global
     * @mcs
     */
    function AnalyticsEvent(name) {
        /**
         * The name of the event.
         * @type {String}
         * @name AnalyticsEvent#name
         * @mcs
         */
        this.name = null;
        /**
         * The timestamp of the event. The system will populate with the current time by default.
         * @type {String}
         * @name AnalyticsEvent#timestamp
         * @mcs
         */
        this.timestamp = new Date().toISOString();
        /**
         * The ID of the current session.
         * @type {String}
         * @name AnalyticsEvent#sessionID
         * @mcs
         */
        this.sessionID = null;
        /**
         * Custom caller specifiable properties as key/value strings.
         * @type {Object}
         * @name AnalyticsEvent#properties
         * @mcs
         */
        this.properties = {};
        this.name = name;
    }
    return AnalyticsEvent;
}());
exports.AnalyticsEvent = AnalyticsEvent;


/***/ }),
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(0);
var network_response_1 = __webpack_require__(2);
/**
 * Base class for platform-specific capabilities. Users may derive from this class to
 * provide implementations specific to their platform.
 * @abstract
 * @private
 */
var Platform = /** @class */ (function () {
    function Platform(config, utils, logger) {
        this._logHTTP = false;
        this._queryRegex = (/\?/);
        this._deviceState = typeof deviceState !== 'undefined' ? deviceState.unrestricted : null;
        this._deviceStateChangedCallbacks = [];
        this.ANDROID_OS_NAME = '';
        this.IOS_OS_NAME = '';
        this._logHTTP = typeof config.logHTTP !== 'undefined' ? config.logHTTP : false;
        this._config = config;
        this._utils = utils;
        this._deviceId = utils.uuid();
        this._logger = logger;
    }
    Platform.prototype.initGPSLocation = function () { };
    /**
     * Returns a device ID used by [Diagnostics]{@link Diagnostics}.
     * @returns {String} The device ID.
     */
    Platform.prototype.getDeviceId = function () {
        return this._deviceId;
    };
    /**
     * Sets the current state of the device. Platform implementations should call this function
     * when the state changes. The state is inspected before background operations
     * like synchronization are performed.
     * @param state {mcs._deviceState} The new state of the device.
     */
    Platform.prototype.setDeviceState = function (state) {
        if (this._deviceState !== state) {
            this._logger.info('Device state changing from ' + this._deviceState + ' to ' + state);
            this._deviceState = state;
            for (var _i = 0, _a = this._deviceStateChangedCallbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback(this._deviceState);
            }
        }
    };
    /**
     * Class that provides the current GPS location of the device.
     * @typedef {Object} Platform.GPSLocation
     * @property {String} latitude - The device's current latitude.
     * @property {String} longitude - The device's current longitude.
     */
    /**
     * Returns an object that has the current GPS location of the device or null.
     * @returns {Platform~GPSLocation} The GPS location is available.
     */
    Platform.prototype.getGPSLocation = function () {
        return {
            latitude: null,
            longitude: null,
        };
    };
    /**
     * Class that provides information about the device.
     * @typedef {Object} Platform.DeviceInformation
     * @property {String} model - The device's model.
     * @property {String} manufacturer - The device's manufacturer.
     * @property {String} osName - The operating system.
     * @property {String} osVersion - The operating system's version.
     * @property {String} osBuild - The operating system's build number.
     * @property {String} carrier - The device's wireless carrier.
     */
    /**
     * Returns an object with device information used by [Analytics]{@link Analytics}
     * @returns {Platform~DeviceInformation} The device specific information.
     */
    Platform.prototype.getDeviceInformation = function () {
        return {
            model: '<unknown>',
            manufacturer: '<unknown>',
            osName: '<unknown>',
            osVersion: '<unknown>',
            osBuild: '<unknown>',
            carrier: '<unknown>',
        };
    };
    /**
     * Performs an HTTP request.
     * @param request {Object} The format of the request parameter is identical to the settings parameter in
     * [JQuery's ajax]{@link http://api.jquery.com/jQuery.ajax/} method.
     * However, only the method, url, headers ,data, success
     * and error properties are used.
     * @abstract
     */
    Platform.prototype.invokeService = function (request) {
        var url = request.url;
        if (this.isBrowser) {
            url = url + (this._queryRegex.test(url) ? '&' : '?') + '_=' + new Date().getTime();
        }
        return new Promise(invoke.bind(this));
        function invoke(resolve, reject) {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr.open(request.method, url);
            xhr.timeout = 280000; // time in milliseconds
            for (var key in request.headers) {
                if (request.headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, request.headers[key]);
                }
            }
            this._setRequestHeaders(xhr, request);
            xhr.withCredentials = request.hasOwnProperty('withCredentials') && typeof request.withCredentials === 'boolean'
                ? request.withCredentials
                : true;
            xhr.responseType = request.responseType || types_1.XMLHttpRequestResponseTypes.JSON;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var response = xhr.responseType === '' || xhr.responseType === 'text' ? xhr.responseText : xhr.response;
                    var headers = xhr['responseHeaders'] ?
                        _this._utils.normalizeHeaderKeys(xhr['responseHeaders']) :
                        _this._utils.parseHeaders(xhr.getAllResponseHeaders());
                    var netResponse = new network_response_1.NetworkResponse(xhr.status, response, headers);
                    if (_this._logHTTP) {
                        var object = {
                            headers: headers,
                            body: response,
                        };
                        _this._logger.debug('Received ' + request.method + ' response from ' + request.url, object);
                    }
                    if (xhr.status >= 200 && xhr.status <= 299) {
                        resolve(netResponse);
                    }
                    else {
                        reject(netResponse);
                    }
                }
            };

            xhr.ontimeout = function (e) {
              // XMLHttpRequest timed out. Do something here.
              console.error("The request for " + url + " timed out.");
              var netResponse = new network_response_1.NetworkResponse(500, {Error:"API Timed Out"}, '');
              reject(netResponse);
              xhr.abort();
            };

            xhr.send(request.data);
            if (this._logHTTP) {
                var object = {
                    headers: request.headers,
                    body: request.data,
                };
                this._logger.debug('Sent ' + request.method + ' request to ' + request.url, object);
            }
        }
    };
    Platform.prototype._setRequestHeaders = function (xhr, request) {
        xhr.setRequestHeader(types_1.Headers.ORACLE_MOBILE_CLIENT_SDK_INFO, this.getClientSDKInfoHeader(request.module));
    };
    Platform.prototype.getClientSDKInfoHeader = function (module) {
        var infoHeader = this._getPlatform();
        infoHeader += ' ' + (this._config.mcsVersion || 'Unknown');
        infoHeader += ' [' + module + ']';
        return infoHeader;
    };
    return Platform;
}());
exports.Platform = Platform;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 * Created by Yuri Panshin on 2016-08-26.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @classdesc Class that provides network storage object details.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var NetworkStorageObject = /** @class */ (function () {
    function NetworkStorageObject(statusCode, storageObject) {
        /**
         * The network status code.
         * @type {Number}
         * @readonly
         * @name NetworkStorageObject#statusCode
         * @mcs
         */
        this.statusCode = 0;
        /**
         * The error data.
         * @type {StorageObject}
         * @readonly
         * @name NetworkStorageObject#storageObject
         * @mcs
         */
        this.storageObject = null;
        this.statusCode = statusCode;
        this.storageObject = storageObject;
    }
    return NetworkStorageObject;
}());
exports.NetworkStorageObject = NetworkStorageObject;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var storage_object_1 = __webpack_require__(17);
var network_storage_object_1 = __webpack_require__(22);
var types_1 = __webpack_require__(0);
/**
 * @classdesc Class that holds the StorageCollection resource. StorageCollections contain Storage objects
 * which can be used to persist data in Oracle Mobile Cloud Enterprise.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var StorageCollection = /** @class */ (function () {
    function StorageCollection(name, userId, userIsolated, backend, utils, logger, platform) {
        this.userIsolated = userIsolated;
        this.backend = backend;
        this.utils = utils;
        this.logger = logger;
        this.platform = platform;
        this.storage = backend.storage;
        this.userId = utils.validateConfiguration(userId);
        this.id = utils.validateConfiguration(name);
    }
    /**
     * Get description.
     * The description of the StorageCollection.
     * @return {String}
     * @function
     * @name StorageCollection#getDescription
     * @mcs
     */
    StorageCollection.prototype.getDescription = function () {
        if (this.data) {
            return this.data.description;
        }
        else {
            this.logger.warn('Collection metadata was not loaded yet, ' +
                'please use StorageCollection.loadMetadata to load metadata.');
            return null;
        }
    };
    StorageCollection.prototype.getUserIsolated = function () {
        return this.data ? this.data.userIsolated : this.userIsolated;
    };
    /**
     * Get storage.
     * Returns storage object for current storage collection.
     * @return {Storage} storage object data for current storage collection.
     * @function
     * @name StorageCollection#getStorage
     * @mcs
     */
    StorageCollection.prototype.getStorage = function () {
        return this.storage;
    };
    /**
     * Get user id.
     * Returns user ID for current storage collection.
     * @return {string} user ID for current storage collection.
     * @function
     * @name StorageCollection#getUserId
     */
    StorageCollection.prototype.getUserId = function () {
        return this.userId;
    };
    /**
     * Get data.
     * Returns data for current storage collection.
     * @return {object} storage object data for current storage collection.
     * @function
     * @name StorageCollection#getData
     * @mcs
     */
    StorageCollection.prototype.getData = function () {
        return this.data;
    };
    /**
     * Convert collection to static object that used by JSON.stringify
     * @ignore
     */
    StorageCollection.prototype.toJSON = function () {
        return {
            id: this.id,
            description: this.getDescription(),
            userId: this.getUserId(),
            userIsolated: this.getUserIsolated(),
            data: this.getData(),
        };
    };
    /**
     * Load metadata.
     * Load collection metadata
     * @returns {Promise<StorageCollection|NetworkResponse>}
     * @function
     * @name StorageCollection#loadMetadata
     * @mcs
     */
    StorageCollection.prototype.loadMetadata = function () {
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.ACCEPT, types_1.ContentTypes.APPLICATION_JSON);
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.GET,
            url: this.backend.getPlatformUrl('storage/collections/' + this.id),
            module: types_1.ModuleNames.STORAGE,
        }).then(invokeServiceSuccess.bind(this));
        function invokeServiceSuccess(response) {
            this.data = response.data;
            return this;
        }
    };
    /**
     * Get objects.
     * Returns a list of StorageObjects from the collection starting from the offset and up to the limit.
     * The service may return fewer objects.<br/>
     * 1. If the collection is a shared collection, then it returns all the objects.<br/>
     * 2. If the collection is a user-isolated collection and allObjects is false,
     * then it returns the objects which belong to the current user.<br/>
     * 3. If the collection is user-isolated collection, and allObjects is true,
     * then it returns all the objects in the collection.<br/>
     * The objects might belong to other users. And the current user MUST have READ_ALL or READ_WRITE_ALL permission.
     * @param offset {Number} The offset at which to start. Must be greater than 0.
     * @param limit {Number} The max number of StorageObjects to return. Must be non-negative.
     * @param allObjects {Boolean} whether to return all the objects in the list.
     * @return {Promise<Array<StorageObject>|NetworkResponse>}
     * @function
     * @name StorageCollection#getObjects
     * @mcs
     */
    StorageCollection.prototype.getObjects = function (offset, limit, allObjects) {
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.ACCEPT, types_1.ContentTypes.APPLICATION_JSON);
        var url = 'storage/collections/' + this.id + '/objects';
        if (offset != null) {
            url += url.indexOf('?') == -1 ? '?' : '&';
            url += 'offset=' + offset;
        }
        if (limit != null) {
            url += url.indexOf('?') == -1 ? '?' : '&';
            url += 'limit=' + limit;
        }
        if (this.getUserIsolated() && allObjects) {
            url += url.indexOf('?') == -1 ? '?' : '&';
            url += 'user=*';
        }
        else if (this.getUserIsolated() && this.getUserId()) {
            url += url.indexOf('?') == -1 ? '?' : '&';
            url += 'user=' + this.getUserId();
        }
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.GET,
            url: this.backend.getPlatformUrl(url),
            module: types_1.ModuleNames.STORAGE,
        }).then(invokeServiceSuccess.bind(this));
        function invokeServiceSuccess(response) {
            var objects = [];
            var objectsJson = response.data;
            for (var i = 0; i < objectsJson.items.length; i++) {
                objects[objects.length] = new storage_object_1.StorageObject(this, objectsJson.items[i]);
            }
            return objects;
        }
    };
    /**
     * Returns a StorageObject given its ID. The contents of the object will be downloaded lazily.
     * @function
     * @name StorageCollection#getObject
     * @param id {string} The ID of the Storage Object to return.
     * @param objectType {string} responseType for the XMLHttpRequest Object.
     * Default response type if not defined is json.
     * Ths parameter can be one of the types: 'json', 'blob', 'arraybuffer', 'document', 'text'.
     * @return {Promise<StorageObject|NetworkResponse>}
     *
     * @example StorageCollection.getObject('00e39862-9652-458b-9a82-d1a66cf1a0c7', mcs.RESPONSE_TYPES.BLOB).then(
     * function(storageObject){
     * },
     * function(networkResponse){
     * });
     * @mcs
     */
    StorageCollection.prototype.getObject = function (id, objectType) {
        var storageObject = new storage_object_1.StorageObject(this, this.backend);
        storageObject.id = id;
        return storageObject
            .readPayload(objectType)
            .then(readPayloadSuccess);
        function readPayloadSuccess() {
            return storageObject;
        }
    };
    StorageCollection.prototype.loadObjectPayload = function (objectId, objectType) {
        var headers = this.backend.getHttpHeaders();
        var url = 'storage/collections/' + this.id + '/objects/' + objectId;
        if (this.userId != null && this.getUserIsolated()) {
            url += '?user=' + this.userId;
        }
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.GET,
            url: this.backend.getPlatformUrl(url),
            responseType: objectType || types_1.XMLHttpRequestResponseTypes.JSON,
            module: types_1.ModuleNames.STORAGE,
        });
    };
    /**
     * Post object.
     * Creates a new StorageObject in the collection.
     * @function
     * @name StorageCollection#postObject
     * @param storageObject {StorageObject} The StorageObject to create.
     * @example storageObject:
     * {
   * "id": " 213ddbac-ccb2-4a53-ad48-b4588244tc4c", // A service generated ID for the StorageObject.
   * The ID is unique in the StorageCollection.
   * "name" : "JSText.txt", // A user provided name for the StorageObject.
   * A StorageCollection may have multiple StorageObjects with the same name.
   * "contentLength": 798", // The length of data content in bytes stored in the StorageObject.
   * "contentType" : "text/plain ", // The media-type associated with the StorageObject.
   * "createdBy" : "DwainDRob", // The name of the user who created the StorageObject
   * "createdOn": "Sat, 17 Oct 2015 10:33:12", // Server generated timestamp when the StorageObject was created.
   * "modifiedBy": "DwainDRob", // The name of the user who last updated the StorageObject.
   * "modifiedOn": "Sat, 17 Oct 2015 10:33:12" //  Server generated timestamp when the StorageObject was last updated.
   * }
     * @return {Promise<NetworkResponse>}
     * @mcs
     */
    StorageCollection.prototype.postObject = function (storageObject) {
        return this._postOrPutStorageObject(storageObject, true);
    };
    /**
     * Put object.
     * Updates an existing StorageObject in the collection.
     * @function
     * @name StorageCollection#putObject
     * @param storageObject {StorageObject} The StorageObject to update.
     * @return {Promise<NetworkStorageObject|NetworkResponse>}
     * @mcs
     */
    StorageCollection.prototype.putObject = function (storageObject) {
        return this._postOrPutStorageObject(storageObject, false);
    };
    StorageCollection.prototype._postOrPutStorageObject = function (storageObject, isPost) {
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.ORACLE_MOBILE_NAME, encodeURI(storageObject.getDisplayName()));
        headers.add(types_1.Headers.CONTENT_TYPE, storageObject.contentType);
        var url = 'storage/collections/' + this.id + '/objects';
        if (!isPost) {
            url += '/' + storageObject.id;
            if (storageObject._eTag != null) {
                headers.add(types_1.Headers.IF_MATCH, storageObject._eTag);
            }
        }
        if (this.getUserIsolated() && this.getUserId()) {
            url += '?user=' + this.getUserId();
        }
        return this.platform.invokeService({
            headers: headers,
            method: isPost ? types_1.HttpMethods.POST : types_1.HttpMethods.PUT,
            url: this.backend.getPlatformUrl(url),
            data: storageObject._payload,
            module: types_1.ModuleNames.STORAGE,
        }).then(invokeServiceSuccess.bind(this));
        function invokeServiceSuccess(response) {
            var object = new storage_object_1.StorageObject(this, response.data);
            return new network_storage_object_1.NetworkStorageObject(response.statusCode, object);
        }
    };
    /**
     * Is object exists in the collection.
     * Checks the service if a StorageObject with the given ID exists in the collection.
     * @function
     * @name StorageCollection#contains
     * @param id {String} The ID of the StorageObject to check.
     * @return {Promise<NetworkResponse>}
     * @mcs
     */
    StorageCollection.prototype.contains = function (id) {
        var headers = this.backend.getHttpHeaders();
        var url = 'storage/collections/' + this.id + '/objects/' + id;
        if (this.getUserIsolated() && this.getUserId()) {
            url += '?user=' + this.getUserId();
        }
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.HEAD,
            url: this.backend.getPlatformUrl(url),
            module: types_1.ModuleNames.STORAGE,
        });
    };
    /**
     * Delete object.
     * Deletes a StorageObject from a collection.
     * @function
     * @name StorageCollection#deleteObject
     * @param id {String} The ID of the StorageObject to delete.
     * @return {Promise<NetworkResponse>}
     * @mcs
     */
    StorageCollection.prototype.deleteObject = function (id) {
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.IF_MATCH, '*');
        var url = 'storage/collections/' + this.id + '/objects/' + id;
        if (this.getUserIsolated() && this.getUserId()) {
            url += '?user=' + this.getUserId();
        }
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.DELETE,
            url: this.backend.getPlatformUrl(url),
            module: types_1.ModuleNames.STORAGE,
        });
    };
    return StorageCollection;
}());
exports.StorageCollection = StorageCollection;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var storage_collection_1 = __webpack_require__(23);
/**
 * @classdesc Class that provides cloud-based storage capabilities. Callers should use
 * MobileBackend's [storage]{@link Backend#storage} property.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var Storage = /** @class */ (function () {
    function Storage(backend, utils, platform) {
        this.backend = backend;
        this.utils = utils;
        this.platform = platform;
        this.logger = new logger_1.Logger('Storage');
    }
    /**
     * Returns a StorageCollection with the given name from the service associated with the user.
     * Subsequent accesses to StorageObjects in the
     * StorageCollection will only return StorageObjects owned by the user.
     * @function
     * @name Storage#getCollection
     * @param name {String} The name of the StorageCollection.
     * @param [userId] {String} Optional, the ID of the user retrieved from the UI.
     * @param [userIsolated] {Boolean} - indicate if collection is in isolated mode,
     * used in combination with lazyLoad and userId.
     * This parameter is not required in case lazyLoad is not provided.
     * @param [lazyLoad] {Boolean} - indicate not to load collection metadata
     * @return {Promise<StorageCollection|NetworkResponse>}
     * @mcs
     */
    Storage.prototype.getCollection = function (name, userId, userIsolated, lazyLoad) {
        var collection = new storage_collection_1.StorageCollection(name, userId, userIsolated, this.backend, this.utils, this.logger, this.platform);
        if (lazyLoad) {
            return Promise.resolve(collection);
        }
        else {
            return collection.loadMetadata();
        }
    };
    return Storage;
}());
exports.Storage = Storage;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*
* @author Yuri Panshin
*/
Object.defineProperty(exports, "__esModule", { value: true });
var dictionary_1 = __webpack_require__(3);
/**
 * @classdesc Class that exposes fluent APIs for fetching objects from an API endpoint.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var FetchCollectionBuilder = /** @class */ (function () {
    function FetchCollectionBuilder(endpoint, json) {
        this.endpoint = endpoint;
        this.json = json;
        this._fetchFromService = false;
        this._offset = -1;
        this._limit = -1;
        this._fetchAll = false;
        this._withParams = {};
        this._withHeaders = new dictionary_1.Dictionary([]);
    }
    /**
     * Execute the query.
     * Executes the fetch and returns the results.
     * @function
     * @name FetchCollectionBuilder#execute
     * @return {Promise<MobileObjectCollection|NetworkResponse>}
     * @mcs
     */
    FetchCollectionBuilder.prototype.execute = function () {
        return this.endpoint._executeFetchObjects(this._withHeaders, this._withParams, this._fetchAll, this._offset, this._limit, this._fetchFromService);
    };
    return FetchCollectionBuilder;
}());
exports.FetchCollectionBuilder = FetchCollectionBuilder;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mobile_resource_1 = __webpack_require__(16);
var sync_resource_type_1 = __webpack_require__(10);
/**
 * @classdesc Class that represents a collection of MobileObjects returned by a custom code API.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var MobileObjectCollection = /** @class */ (function (_super) {
    __extends(MobileObjectCollection, _super);
    function MobileObjectCollection(endpoint, uri) {
        var _this = _super.call(this, endpoint, uri) || this;
        _this._type = sync_resource_type_1.SyncResourceType.item;
        _this._objects = [];
        return _this;
    }
    MobileObjectCollection.prototype.initialize = function (objects) {
        for (var idx in objects) {
            if (objects.hasOwnProperty(idx)) {
                var object = objects[idx];
                this._objects.push(object);
            }
        }
        return this;
    };
    /**
     * Get Length.
     * The count of items in the collection
     * @function
     * @name MobileObjectCollection#getLength
     * @returns {number}
     * @mcs
     */
    MobileObjectCollection.prototype.getLength = function () {
        return this._objects.length;
    };
    ;
    /**
     * Get item.
     * Return specific object from collection.
     * @function
     * @name MobileObjectCollection#getItem
     * @param idx {number} item position in collection.
     * @return {MobileObject}
     * @mcs
     */
    MobileObjectCollection.prototype.getItem = function (idx) {
        return this._objects[idx];
    };
    ;
    /**
     * All.
     * Return all objects from collection.
     * @function
     * @name MobileObjectCollection#all
     * @return {MobileObject[]}
     * @mcs
     */
    MobileObjectCollection.prototype.all = function () {
        return this._objects;
    };
    ;
    /**
     * Run this method on every object.
     * @callback MobileObjectCollection#forEachCallback
     * @param object {MobileObject} the mobile object.
     * @mcs
     */
    /**
     * For each.
     * Run method per item
     * @function
     * @name MobileObjectCollection#forEach
     * @param method {MobileObjectCollection#forEachCallback} method to run on item.
     * @mcs
     */
    MobileObjectCollection.prototype.forEach = function (method) {
        this._objects.forEach(method);
    };
    return MobileObjectCollection;
}(mobile_resource_1.MobileResource));
exports.MobileObjectCollection = MobileObjectCollection;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sync_processor_1 = __webpack_require__(5);
var types_1 = __webpack_require__(0);
var dictionary_1 = __webpack_require__(3);
var DeleteProcessor = /** @class */ (function (_super) {
    __extends(DeleteProcessor, _super);
    function DeleteProcessor(backend, apiName, endpointPath, platform, utils, common, options) {
        return _super.call(this, backend, apiName, endpointPath, false, utils, platform, options, common) || this;
    }
    DeleteProcessor.prototype.performRequest = function (url) {
        var headers = this.getHttpHeaders(new dictionary_1.Dictionary([]));
        return this.platform.invokeService({
            url: url,
            headers: headers,
            method: types_1.HttpMethods.DELETE,
            module: types_1.ModuleNames.SYNC,
        });
    };
    return DeleteProcessor;
}(sync_processor_1.SyncProcessor));
exports.DeleteProcessor = DeleteProcessor;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
var sync_processor_1 = __webpack_require__(5);
var types_1 = __webpack_require__(0);
var PutProcessor = /** @class */ (function (_super) {
    __extends(PutProcessor, _super);
    function PutProcessor(backend, apiName, endpointPath, platform, utils, common, options) {
        return _super.call(this, backend, apiName, endpointPath, false, utils, platform, options, common) || this;
    }
    PutProcessor.prototype.performRequest = function (url, requestHeaders, requestData) {
        var _this = this;
        var headers = this.getHttpHeaders(requestHeaders);
        return this.platform.invokeService({
            url: url,
            headers: headers,
            method: types_1.HttpMethods.PUT,
            data: requestData,
            module: types_1.ModuleNames.SYNC,
        }).then(function (response) {
            return {
                uri: _this.getUri(response, url),
                data: response.data,
            };
        });
    };
    return PutProcessor;
}(sync_processor_1.SyncProcessor));
exports.PutProcessor = PutProcessor;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
var sync_processor_1 = __webpack_require__(5);
var types_1 = __webpack_require__(0);
var PostProcessor = /** @class */ (function (_super) {
    __extends(PostProcessor, _super);
    function PostProcessor(backend, apiName, endpointPath, platform, utils, common, options) {
        return _super.call(this, backend, apiName, endpointPath, false, utils, platform, options, common) || this;
    }
    PostProcessor.prototype.performRequest = function (url, requestHeaders, requestData) {
        var _this = this;
        var headers = this.getHttpHeaders(requestHeaders);
        return this.platform.invokeService({
            url: url,
            headers: headers,
            method: types_1.HttpMethods.POST,
            data: requestData,
            module: types_1.ModuleNames.SYNC,
        }).then(function (response) {
            return {
                uri: _this.getUri(response, url),
                data: response.data,
            };
        });
    };
    return PostProcessor;
}(sync_processor_1.SyncProcessor));
exports.PostProcessor = PostProcessor;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sync_processor_1 = __webpack_require__(5);
var types_1 = __webpack_require__(0);
var GetProcessor = /** @class */ (function (_super) {
    __extends(GetProcessor, _super);
    function GetProcessor(backend, apiName, endpointPath, platform, utils, common, options) {
        return _super.call(this, backend, apiName, endpointPath, false, utils, platform, options, common) || this;
    }
    GetProcessor.prototype.performRequest = function (url, requestHeaders, fetchFromService) {
        var headers = this.getHttpHeaders(requestHeaders);
        return this.platform.invokeService({
            url: url,
            headers: headers,
            method: types_1.HttpMethods.GET,
            module: types_1.ModuleNames.SYNC,
        }).then(success.bind(this));
        function success(response) {
            return {
                uri: this.getUri(response, url),
                data: response.data,
            };
        }
    };
    return GetProcessor;
}(sync_processor_1.SyncProcessor));
exports.GetProcessor = GetProcessor;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sync_resource_type_1 = __webpack_require__(10);
var mobile_resource_1 = __webpack_require__(16);
/**
 * @classdesc Class that represents an object returned by a custom code API.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var MobileObject = /** @class */ (function (_super) {
    __extends(MobileObject, _super);
    function MobileObject(endpoint, uri) {
        var _this = _super.call(this, endpoint, uri) || this;
        _this._type = sync_resource_type_1.SyncResourceType.item;
        return _this;
    }
    MobileObject.prototype._assign = function (object) {
        if (object === void 0) { object = {}; }
        object['__proto__'] = this;
        return object;
    };
    /**
     * Save the object.
     * Saves any changes to the object back to the service.
     * @function
     * @name MobileObject#save
     * @param saveIfOffline {Boolean} If true will cache updates locally and sync them back to the service
     * if the device is offline;
     * if false will fail if the device is offline.
     * @return {Promise<MobileObject>}
     * @mcs
     */
    MobileObject.prototype.save = function (saveIfOffline) {
        return this._getEndpoint()._save(this, saveIfOffline);
    };
    /**
     * Delete the object.
     * Saves any changes to the object back to the service.
     * @function
     * @name MobileObject#delete
     * @return {Promise<NetworkResponse>}
     * @mcs
     */
    MobileObject.prototype.delete = function () {
        return this._getEndpoint()._delete(this);
    };
    return MobileObject;
}(mobile_resource_1.MobileResource));
exports.MobileObject = MobileObject;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mobile_object_1 = __webpack_require__(31);
var get_processor_1 = __webpack_require__(30);
var post_processor_1 = __webpack_require__(29);
var put_processor_1 = __webpack_require__(28);
var delete_processor_1 = __webpack_require__(27);
var mobile_object_collection_1 = __webpack_require__(26);
var fetch_collection_builder_1 = __webpack_require__(25);
var network_response_1 = __webpack_require__(2);
var types_1 = __webpack_require__(0);
var dictionary_1 = __webpack_require__(3);
/**
 * @classdesc Class that represents an endpoint in a custom code API. Callers should use
 * [Synchronization.openEndpoint()]{@link Synchronization#openEndpoint} to create a new MobileEndpoint.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var MobileEndpoint = /** @class */ (function () {
    function MobileEndpoint(synchronization, apiName, endpointPath, backend, utils, platform, common, options) {
        var _this = this;
        this.backend = backend;
        this.utils = utils;
        this.platform = platform;
        this.common = common;
        this.options = options;
        /**
         * Purge cache.
         * Deletes all cached resources.
         * @function
         * @name MobileEndpoint#purge
         * @mcs
         */
        this.purge = function () {
            _this.options.module.flush(_this.backend.getCustomCodeUrl(_this.apiName + '/' + _this.endpointPath));
        };
        this.synchronization = synchronization;
        this.apiName = apiName;
        this.endpointPath = endpointPath;
    }
    /**
     * Create MobileObject.
     * Creates a new MobileObject.
     * The object is not uploaded to the service until [save()]{@link MobileObject#save} is invoked.
     * @function
     * @name MobileEndpoint#purge
     * @returns {MobileObject} A new MobileObject.
     * @mcs
     */
    MobileEndpoint.prototype.createObject = function (object) {
        if (object === void 0) { object = {}; }
        return new mobile_object_1.MobileObject(this, null)._assign(object);
    };
    /**
     * Resource processor response.
     * @typedef ResourceProcessorResponse
     * @property {string} uri
     * @property {object} data
     * @mcs
     */
    /**
     * Fetch MobileObject.
     * Fetches an object from the API's endpoint.
     * @function
     * @name MobileEndpoint#fetchObject
     * @param id {String} The ID of the object.
     * @param fetchFromService {Boolean} If true will download from the service; if false will return any pinned object
     * and will trigger a background refresh.
     * @return {Promise<MobileObject|ResourceProcessorResponse>}
     * @mcs
     */
    MobileEndpoint.prototype.fetchObject = function (id, fetchFromService) {
        var url = this.apiName;
        if (this.endpointPath && this.endpointPath.length > 0) {
            url += '/' + this.endpointPath;
        }
        if (id && id !== '') {
            url += '/' + id;
        }
        url = this.backend.getCustomCodeUrl(url);
        var processor = new get_processor_1.GetProcessor(this.backend, this.apiName, this.endpointPath, this.platform, this.utils, this.common, this.options);
        var headers = new dictionary_1.Dictionary([]);
        headers.add(types_1.Headers.ACCEPT, types_1.ContentTypes.APPLICATION_JSON);
        return processor.performRequest(url, headers, fetchFromService).then(performRequestSuccess.bind(this));
        function performRequestSuccess(resource) {
            if (!resource.data || resource.data === '') {
                return Promise.reject(new network_response_1.NetworkResponse(404, 'Object not found in cache.'));
            }
            else {
                var object = resource.data;
                if (typeof object === 'string') {
                    object = object !== '' ? JSON.parse(object) : null;
                }
                return new mobile_object_1.MobileObject(this, resource.uri)._assign(object);
            }
        }
    };
    MobileEndpoint.prototype._save = function (mobileObject, saveIfOffline) {
        var _this = this;
        var isPost = !mobileObject._getMcsURI();
        var url = isPost ?
            this.backend.getCustomCodeUrl(this.apiName + '/' + this.endpointPath) :
            this._getMcsURI(mobileObject);
        var processor = isPost ?
            new post_processor_1.PostProcessor(this.backend, this.apiName, this.endpointPath, this.platform, this.utils, this.common, this.options) :
            new put_processor_1.PutProcessor(this.backend, this.apiName, this.endpointPath, this.platform, this.utils, this.common, this.options);
        var data = JSON.stringify(mobileObject);
        var headers = new dictionary_1.Dictionary([]);
        headers.add(types_1.Headers.ACCEPT, types_1.ContentTypes.APPLICATION_JSON);
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.APPLICATION_JSON);
        return processor.performRequest(url, headers, data)
            .then(function (resource) {
            var object = resource.data;
            if (typeof object === 'string') {
                object = object !== '' ? JSON.parse(object) : null;
            }
            _this._updateMobileObject(mobileObject, object);
            mobileObject.__proto__ = new mobile_object_1.MobileObject(_this, resource.uri);
            return mobileObject;
        });
    };
    MobileEndpoint.prototype._delete = function (mobileObject) {
        var _this = this;
        var processor = new delete_processor_1.DeleteProcessor(this.backend, this.apiName, this.endpointPath, this.platform, this.utils, this.common, this.options);
        var url = this._getMcsURI(mobileObject);
        return processor.performRequest(url)
            .then(function (response) {
            _this._updateMobileObject(mobileObject._syncResource);
            mobileObject._syncResource = null;
            return response;
        });
    };
    MobileEndpoint.prototype._getMcsURI = function (mobileObject) {
        var uri = mobileObject._getMcsURI();
        if (!uri.startsWith('http')) {
            return this.backend._baseUrl + uri;
        }
        else {
            return uri;
        }
    };
    MobileEndpoint.prototype._updateMobileObject = function (mobileObject, newObject) {
        if (newObject === void 0) { newObject = {}; }
        for (var property in mobileObject) {
            if (mobileObject.hasOwnProperty(property)) {
                delete mobileObject[property];
            }
        }
        for (var property in newObject) {
            if (newObject.hasOwnProperty(property)) {
                mobileObject[property] = newObject[property];
            }
        }
    };
    MobileEndpoint.prototype._executeFetchObjects = function (withHeaders, withParams, fetchAll, offset, limit, fetchFromService) {
        var endpoint = this;
        var headers = this.backend.getHttpHeaders(withHeaders);
        headers.add(types_1.Headers.ORACLE_MOBILE_SYNC_AGENT, 'true');
        var request = {
            method: types_1.HttpMethods.GET,
            url: this.backend.getCustomCodeUrl(this.apiName + '/' + this.endpointPath),
            headers: headers,
            module: types_1.ModuleNames.SYNC,
        };
        return this.platform.invokeService(request).then(invokeServiceSuccess.bind(this));
        function invokeServiceSuccess(response) {
            var data = response.data;
            if (typeof data === 'string') {
                data = data !== '' ? JSON.parse(data) : null;
            }
            var objects = [];
            for (var idx in data.items) {
                if (data.items.hasOwnProperty(idx)) {
                    var object = data.items[idx];
                    var uri = '/' + data.uris[idx];
                    objects.push(new mobile_object_1.MobileObject(endpoint, uri)._assign(object));
                }
            }
            return new mobile_object_collection_1.MobileObjectCollection(endpoint, /*syncResource*/ null).initialize(objects);
        }
    };
    /**
     * Fetch mobile objects.
     * Method to fetch a collection of objects from the endpoint.
     * If the collection exists in the cache, the cached copy is returned; otherwise it is downloaded from the service..
     * @function
     * @name MobileEndpoint#fetchObjects
     * @return {FetchCollectionBuilder}
     * @mcs
     */
    MobileEndpoint.prototype.fetchObjects = function () {
        return new fetch_collection_builder_1.FetchCollectionBuilder(this);
    };
    return MobileEndpoint;
}());
exports.MobileEndpoint = MobileEndpoint;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mobile_endpoint_1 = __webpack_require__(32);
var logger_1 = __webpack_require__(1);
/**
 * @classdesc Class that provides caching and synchronization capabilities. Callers should use
 * MobileBackend's [synchronization]{@link Backend#synchronization} property.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var Synchronization = /** @class */ (function () {
    function Synchronization(backend, utils, platform, common, options, process) {
        this.utils = utils;
        this.platform = platform;
        this.common = common;
        this.options = options;
        this.process = process;
        this._endpoints = {};
        this.logger = new logger_1.Logger('Synchronization');
        this.backend = backend;
        if (!options['_originalIsOnline']) {
            options['_originalIsOnline'] = options.isOnline.bind(options);
        }
        var _isOffline = false;
        options.isOnline = function () {
            return _isOffline === false ? options['_originalIsOnline']() : !_isOffline;
        };
        this.setOfflineMode = function (isOffline) {
            _isOffline = (typeof isOffline === 'boolean') ? isOffline : true;
        };
    }
    /**
     * Is online.
     * Gets device network status which is currently being used by Synchronization.
     * @function
     * @name Synchronization#isOnline
     * @returns {Boolean}
     * @mcs
     */
    Synchronization.prototype.isOnline = function () {
        return this.options.isOnline();
    };
    /**
     * Purge cache.
     * Deletes all cached resources.
     * @function
     * @name Synchronization#purge
     * @mcs
     */
    Synchronization.prototype.purge = function () {
        for (var apiName in this._endpoints) {
            if (this._endpoints.hasOwnProperty(apiName)) {
                var api = this._endpoints[apiName];
                for (var path in api) {
                    if (api.hasOwnProperty(path)) {
                        api[path].purge();
                    }
                }
            }
        }
    };
    /**
     * Open endpoint.
     * Returns a [MobileEndpoint]{@link MobileEndpoint} that provides access
     * to an endpoint in a custom code API.
     * @function
     * @name Synchronization#openEndpoint
     * @param {string} apiName The name of the custom code API
     * @param {string} endpointPath The endpoint in the custom code API
     * @returns {MobileEndpoint} A MobileEndpoint object.
     * @mcs
     */
    Synchronization.prototype.openEndpoint = function (apiName, endpointPath) {
        this._endpoints[apiName] = this._endpoints[apiName] || {};
        this._endpoints[apiName][endpointPath] = this._endpoints[apiName][endpointPath] ||
            new mobile_endpoint_1.MobileEndpoint(this, apiName, endpointPath, this.backend, this.utils, this.platform, this.common, this.options);
        return this._endpoints[apiName][endpointPath];
    };
    Synchronization.prototype._run = function (callback) {
        return this.process.run(callback);
    };
    Synchronization.prototype._runWithoutReadInBackground = function (callback) {
        return this.process.runWithoutReadInBackground(callback);
    };
    return Synchronization;
}());
exports.Synchronization = Synchronization;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var authorization_1 = __webpack_require__(4);
var logger_1 = __webpack_require__(1);
var network_response_1 = __webpack_require__(2);
var mcs_authorization_1 = __webpack_require__(7);
var types_1 = __webpack_require__(0);
var dictionary_1 = __webpack_require__(3);
/**
 * @class
 * @global
 * @classdesc Class used to authorize a mobile user against Oracle Mobile Cloud Enterprise. Callers should use
 * MobileBackend's [authorization]{@link Backend#authorization} property.
 * @extends Authorization
 * @hideconstructor
 * @mcs
 */
var OAuthAuthorization = /** @class */ (function (_super) {
    __extends(OAuthAuthorization, _super);
    function OAuthAuthorization(oAuthTokenEndPoint, config, backend, tenantName, utils, platform) {
        var _this = _super.call(this, backend, utils, platform) || this;
        _this.oAuthTokenEndPoint = oAuthTokenEndPoint;
        _this.config = config;
        _this.logger = new logger_1.Logger('OAuthAuthorization');
        _this._clientId = utils.validateConfiguration(config.clientId);
        _this._clientSecret = utils.validateConfiguration(config.clientSecret);
        _this._tenantName = utils.validateConfiguration(tenantName);
        return _this;
    }
    /**
     * Get authorized username.
     * Returns the username of the current authorized user if any, null otherwise.
     * @return {String}
     * @function
     * @name OAuthAuthorization#getAuthorizedUserName
     * @mcs
     */
    OAuthAuthorization.prototype.getAuthorizedUserName = function () {
        return this._authorizedUserName;
    };
    /**
     * Get client id.
     * Returns the client ID for the current backend.
     * @return {String}
     * @function
     * @name OAuthAuthorization#getClientId
     * @mcs
     */
    OAuthAuthorization.prototype.getClientId = function () {
        return this._clientId;
    };
    /**
     * Returns the tenant name for the current backend.
     * @private
     */
    OAuthAuthorization.prototype.getTenantName = function () {
        return this._tenantName;
    };
    /**
     * Get client secret.
     * Returns the client secret for the current backend.
     * @return {String}
     * @function
     * @name OAuthAuthorization#getClientSecret
     * @mcs
     */
    OAuthAuthorization.prototype.getClientSecret = function () {
        return this._clientSecret;
    };
    /**
     * Authenticate.
     * Authenticates a user with the given credentials against the service.
     * The user remains logged in until logout() is called.
     * @param username {String} The username of the credentials.
     * @param password {String} The password of the credentials.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name OAuthAuthorization#authenticate
     * @mcs
     */
    OAuthAuthorization.prototype.authenticate = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var username = params[0];
        var password = params[1];
        this.logout();
        if (!username || !password) {
            this.logger.error('Wrong username or password parameter');
            return Promise.reject(new network_response_1.NetworkResponse(400, 'Bad Request'));
        }
        var authorizationToken = 'Basic ' + this.utils.encodeBase64(this._clientId + ':' + this._clientSecret);
        var scope = this.config.scope || this.backend._baseUrl + 'urn:opc:resource:consumer::all';
        var requestBody = OAuthAuthorization.urlEncodeComponent(username, password, scope);
        var headers = new dictionary_1.Dictionary([]);
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.X_WWW_FORM_FORM_URLENCODED);
        headers.add(types_1.Headers.AUTHORIZATION, authorizationToken);
        if (typeof this._tenantName !== 'undefined') {
            headers.add(types_1.Headers.X_RESOURCE_IDENTITY_DOMAIN_NAME, this._tenantName);
        }
        return this.platform.invokeService({
            headers: headers,
            url: this.getOAuthTokenUrl(),
            method: types_1.HttpMethods.POST,
            data: requestBody,
            withCredentials: false,
            module: types_1.ModuleNames.AUTHORIZATION,
        })
            .then(invokeServiceSuccess.bind(this))
            .catch(invokeServiceError.bind(this));
        function invokeServiceSuccess(response) {
            this._authenticateSuccess(response, response.data.access_token);
            this._authorizedUserName = username;
            return response;
        }
        function invokeServiceError(response) {
            this._authenticateError(response);
            return Promise.reject(response);
        }
    };
    /**
     * Authenticate anonymous.
     * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name OAuthAuthorization#authenticateAnonymous
     * @mcs
     */
    OAuthAuthorization.prototype.authenticateAnonymous = function () {
        var headers = new dictionary_1.Dictionary([]);
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.X_WWW_FORM_FORM_URLENCODED);
        if (typeof this._tenantName !== 'undefined') {
            headers.add(types_1.Headers.X_USER_IDENTITY_DOMAIN_NAME, this._tenantName);
        }
        var scope = this.config.scope || this.backend._baseUrl + 'urn:opc:resource:consumer::all';
        var body = 'grant_type=client_credentials&scope=' + encodeURIComponent(scope);
        return this._authenticateAnonymousInvoke(headers, this.getOAuthTokenUrl(), types_1.HttpMethods.POST, false, body)
            .then(invokeServiceSuccess.bind(this));
        function invokeServiceSuccess(response) {
            this._tokenExpiredTime = Date.now() + response.data.expires_in * 1000;
            return response;
        }
    };
    OAuthAuthorization.prototype._getAnonymousAuthorizationHeaders = function (headers) {
        headers.add(types_1.Headers.AUTHORIZATION, 'Basic ' +
            this.utils.encodeBase64(this.getClientId() + ':' + this.getClientSecret()));
        return headers;
    };
    /**
     * Is authentication token valid.
     * Checks to see if the OAuth token is null, undefined, NaN,an empty string (""), 0,or false.
     * It also checks the timestamp
     * for when the token was first retrieved to see if it was still valid.
     * @returns {Boolean}
     * @function
     * @name OAuthAuthorization#isTokenValid
     * @mcs
     */
    OAuthAuthorization.prototype.isTokenValid = function () {
        if (this.getAccessToken() || this._getAnonymousAccessToken()) {
            this.logger.debug('Token is not null or empty');
            var currentTime = Date.now();
            if (currentTime >= this._tokenExpiredTime) {
                this.logger.info('Token has expired');
                return false;
            }
            else {
                this.logger.debug('Token is still valid');
                return true;
            }
        }
        else {
            return false;
        }
    };
    /**
     * Log out.
     * Logs out the current user and clears credentials and tokens.
     * @function
     * @name OAuthAuthorization#logout
     * @mcs
     */
    OAuthAuthorization.prototype.logout = function () {
        this._clearState();
    };
    /**
     * Refresh token
     * For OAuth, the SDK can not refresh because it does not persist client credentials.
     * This function only exists here because it inherits from the Authorization object,
     * which is also used for other types of authentication in which the token can expire.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name OAuthAuthorization#refreshToken
     * @mcs
     */
    OAuthAuthorization.prototype.refreshToken = function () {
        var isTokenValid = this.isTokenValid();
        if (isTokenValid && !this.getAccessToken() && this._getIsAnonymous()) {
            return Promise.resolve(new network_response_1.NetworkResponse(200, this._getAnonymousAccessToken()));
        }
        else if (isTokenValid && !this._getAnonymousAccessToken() && !this._getIsAnonymous()) {
            return Promise.resolve(new network_response_1.NetworkResponse(200, this._getAnonymousAccessToken()));
        }
        else {
            this.logger.error('Token has expired or user has not been authenticate with the service.');
            return Promise.resolve(new network_response_1.NetworkResponse(401, 'Please use the authenticate with username/password ' +
                'combination or authenticateAnonymous function before using refreshToken.'));
        }
    };
    OAuthAuthorization.prototype._anonymousTokenResponseConverter = function (response) {
        return new authorization_1.AuthenticationResponse(response, response.data.access_token);
    };
    OAuthAuthorization.prototype._clearState = function () {
        _super.prototype._clearState.call(this);
        this._authorizedUserName = null;
        this._tokenExpiredTime = Date.now() * 1000;
    };
    OAuthAuthorization.prototype._getHttpHeaders = function (headers) {
        if (this.getAccessToken() !== null && typeof this.getAccessToken() === 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, 'Bearer ' + this.getAccessToken());
        }
        return headers;
    };
    OAuthAuthorization.prototype._getAnonymousHttpHeaders = function (headers) {
        if (this._getAnonymousAccessToken() && typeof this._getAnonymousAccessToken() === 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, 'Bearer ' + this._getAnonymousAccessToken());
        }
        return headers;
    };
    OAuthAuthorization.urlEncodeComponent = function (username, password, scope) {
        var _username;
        var _password;
        if (username.indexOf('@') > -1) {
            _username = encodeURIComponent(username).replace(/%20/g, '+');
        }
        else {
            _username = encodeURIComponent(username).replace(/%5B/g, '[').replace(/%5D/g, ']');
        }
        if (password.indexOf('&') > -1) {
            _password = encodeURIComponent(password).replace(/%20/g, '+');
        }
        else {
            _password = encodeURIComponent(password).replace(/%5B/g, '[').replace(/%5D/g, ']');
        }
        var _scope = encodeURIComponent(scope);
        return "grant_type=password&username=" + _username + "&password=" + _password + "&scope=" + _scope;
    };
    /**
     * Get OAuth token url.
     * Constructs a full URL, including the prefix, for the OAuth token endpoint.
     * @returns {String} The full URL for the OAuth token endpoint.
     * @function
     * @name OAuthAuthorization#getOAuthTokenUrl
     * @mcs
     */
    OAuthAuthorization.prototype.getOAuthTokenUrl = function () {
        var tokenUri = this.utils.validateConfiguration(this.oAuthTokenEndPoint);
        if (!this.utils.strEndsWith(tokenUri, '/oauth2/v1/token')) {
            tokenUri += '/oauth2/v1/token';
        }
        return tokenUri;
    };
    return OAuthAuthorization;
}(mcs_authorization_1.MCSAuthorization));
exports.OAuthAuthorization = OAuthAuthorization;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class that enables you to retrieve information on the current user and manage its properties. Callers should use
 * Authorization's [getCurrentUser()]{@link Backend#authorization.getCurrentUser} property.
 */
var User = /** @class */ (function () {
    function User(user) {
        this._id = user.id;
        this._userName = user.username;
        this._firstName = user._firstName;
        this._lastName = user._lastName;
        this._email = user.email;
    }
    /**
     * Returns the current user's name.
     *
     * @return Current user's name
     */
    User.prototype.getId = function () {
        return this._id;
    };
    /**
     * Returns first name for current user.
     */
    User.prototype.getFirstName = function () {
        return this._firstName;
    };
    ;
    /**
     * Returns last name for current user.
     */
    User.prototype.getLastName = function () {
        return this._lastName;
    };
    ;
    /**
     * Returns email address for current user.
     */
    User.prototype.getEmail = function () {
        return this._email;
    };
    ;
    return User;
}());
exports.User = User;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var authorization_1 = __webpack_require__(4);
var logger_1 = __webpack_require__(1);
var network_response_1 = __webpack_require__(2);
var mcs_authorization_1 = __webpack_require__(7);
var types_1 = __webpack_require__(0);
var dictionary_1 = __webpack_require__(3);
/**
 * @class
 * @global
 * @classdesc Class used to authorize a mobile user against Oracle Mobile Cloud Enterprise
 * with the Basic Authentication security schema. Callers should use
 * MobileBackend's [authorization]{@link Backend#authorization} property.
 * @extends MCSAuthorization
 * @hideconstructor
 * @mcs
 */
var BasicAuthorization = /** @class */ (function (_super) {
    __extends(BasicAuthorization, _super);
    function BasicAuthorization(config, backend, utils, platform) {
        var _this = _super.call(this, backend, utils, platform) || this;
        _this._logger = new logger_1.Logger('BasicAuthorization');
        _this._backendId = utils.validateConfiguration(config.mobileBackendId);
        _this._anonymousToken = utils.validateConfiguration(config.anonymousKey);
        return _this;
    }
    /**
     * Get authorized user name.
     * Returns the username of the current authorized user if any, null otherwise.
     * @return {String}
     * @function
     * @name BasicAuthorization#getAuthorizedUserName
     * @mcs
     */
    BasicAuthorization.prototype.getAuthorizedUserName = function () {
        return this._authorizedUserName;
    };
    /**
     * Authenticate.
     * Authenticates a user with the given credentials against the service.
     * The user remains logged in until logout() is called.
     * @param username {String} The username of the credentials.
     * @param password {String} The password of the credentials.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name BasicAuthorization#authenticate
     * @mcs
     */
    BasicAuthorization.prototype.authenticate = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var username = params[0];
        var password = params[1];
        this.logout();
        if (!username || !password) {
            this._logger.error('Wrong username or password parameter');
            return Promise.reject(new network_response_1.NetworkResponse(400, 'Bad Request'));
        }
        var authorizationToken = 'Basic ' + this.utils.encodeBase64(username + ':' + password);
        var headers = new dictionary_1.Dictionary([]);
        headers.add(types_1.Headers.AUTHORIZATION, authorizationToken);
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return this.platform.invokeService({
            headers: headers,
            url: this.backend.getPlatformUrl('users/login'),
            method: types_1.HttpMethods.GET,
            module: types_1.ModuleNames.AUTHORIZATION,
        })
            .then(invokeServiceSuccess.bind(this))
            .catch(invokeServiceError.bind(this));
        function invokeServiceSuccess(response) {
            this._authenticateSuccess(response, authorizationToken);
            this._authorizedUserName = username;
            return response;
        }
        function invokeServiceError(response) {
            this._authenticateError(response);
            return Promise.reject(response);
        }
    };
    /**
     * Authenticate anonymously.
     * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name BasicAuthorization#authenticateAnonymous
     * @mcs
     */
    BasicAuthorization.prototype.authenticateAnonymous = function () {
        return this._authenticateAnonymousInvoke(new dictionary_1.Dictionary([]), this.backend.getPlatformUrl('users/login'), types_1.HttpMethods.GET);
    };
    /**
     * Get anonymous authorization headers
     * @param {IDictionary<Headers, string>} headers
     * @return {IDictionary<Headers, string>}
     * @private
     */
    BasicAuthorization.prototype._getAnonymousAuthorizationHeaders = function (headers) {
        headers.add(types_1.Headers.AUTHORIZATION, 'Basic ' + this._anonymousToken);
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return headers;
    };
    /**
     * Is token valid.
     * Checks to see if the authorization token is null, undefined, NaN,an empty string (""), 0, or false.
     * @returns {Boolean}
     * @function
     * @name BasicAuthorization#isTokenValid
     * @mcs
     */
    BasicAuthorization.prototype.isTokenValid = function () {
        if (this.getAccessToken() !== null && typeof this.getAccessToken() == 'string') {
            this._logger.info('Authorization token is not null or empty');
            return true;
        }
        else if (this.getAccessToken() == null && typeof this.getAccessToken() !== 'string') {
            this._logger.info('Authorization token is null and/or empty');
            return false;
        }
    };
    /**
     * Refresh token.
     * For BasicAuth, there is no need to call this function, because the token never expires.
     * This function only exists here because it inherits from the Authorization object, which is also used for other types of authentication in which the token can expire.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name BasicAuthorization#refreshToken
     * @mcs
     */
    BasicAuthorization.prototype.refreshToken = function () {
        if (!this._getIsAuthorized() && !this.isTokenValid()) {
            return Promise.reject(new network_response_1.NetworkResponse(401, 'Please use the authenticate with username/password combination or authenticateAnonymous function before using refreshToken.'));
        }
        else if (this._getIsAuthorized() && this.isTokenValid()) {
            this._logger.debug('Authenticated token is valid, you do not need to refresh.');
            return Promise.resolve(new network_response_1.NetworkResponse(200, this.getAccessToken()));
        }
    };
    /**
     * Log out.
     * Logs out the current user and clears credentials and tokens.
     * @function
     * @name BasicAuthorization#logout
     * @mcs
     */
    BasicAuthorization.prototype.logout = function () {
        this._clearState();
    };
    BasicAuthorization.prototype._anonymousTokenResponseConverter = function (response) {
        return new authorization_1.AuthenticationResponse(response, 'Basic ' + this._anonymousToken);
    };
    BasicAuthorization.prototype._getHttpHeaders = function (headers) {
        if (this.getAccessToken() !== null && typeof this.getAccessToken() == 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, this.getAccessToken());
        }
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return headers;
    };
    BasicAuthorization.prototype._getAnonymousHttpHeaders = function (headers) {
        if (this._getAnonymousAccessToken() && typeof this._getAnonymousAccessToken() == 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, this._getAnonymousAccessToken());
        }
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return headers;
    };
    BasicAuthorization.prototype._clearState = function () {
        _super.prototype._clearState.call(this);
        this._authorizedUserName = null;
    };
    return BasicAuthorization;
}(mcs_authorization_1.MCSAuthorization));
exports.BasicAuthorization = BasicAuthorization;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var analytics_event_1 = __webpack_require__(18);
var logger_1 = __webpack_require__(1);
var network_response_1 = __webpack_require__(2);
var types_1 = __webpack_require__(0);
/**
 * @classdesc Class that provides analytics capabilities. Callers should use
 * MobileBackend's [analytics]{@link Backend#analytics} property.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var Analytics = /** @class */ (function () {
    function Analytics(config, backend, platform, utils) {
        this.config = config;
        this.backend = backend;
        this.platform = platform;
        this.utils = utils;
        this.events = [];
        this.logger = new logger_1.Logger('Analytics');
    }
    /**
     * Returns session ID for current session.
     * @returns {String}
     * @function
     * @name Analytics#getSessionId
     * @mcs
     */
    Analytics.prototype.getSessionId = function () {
        return this.sessionId;
    };
    Analytics.prototype._getEvents = function () {
      return events;
    };
    // 02-07-2018 GS: Set offline analytic events in MCS to flush
    Analytics.prototype._setEvents = function (_events) {
      events = _events;
    };
    /**
     * Starts a new session. If one is in progress, then a new session will not be created.
     * @function
     * @name Analytics#startSession
     * @mcs
     */
    Analytics.prototype.startSession = function () {
        if (!this.sessionId) {
            if (this._locationEnabled()) {
                this.platform.initGPSLocation();
            }
            this.sessionId = this.utils.uuid();
            this.logNamedEvent('sessionStart').type = 'system';
        }
    };
    /**
     * Ends a session if one exists.
     * @return {Promise<Undefined|NetworkResponse>}
     * @function
     * @name Analytics#endSession
     * @mcs
     */
    Analytics.prototype.endSession = function (_location) {
        if (!!this.sessionId) {
            this.logNamedEvent('sessionEnd').type = 'system';
            this.logger.debug('Deactivate a default session');
            return this.flush(_location).then(flushSuccess.bind(this));
        }
        else {
            return Promise.reject(new network_response_1.NetworkResponse(500, 'Session ID is null'));
        }
        function flushSuccess(response) {
            this.sessionId = undefined;
            return response;
        }
    };
    /**
     * Creates a new analytics event with the given name.
     * @param name {String} The name of the event.
     * @returns {AnalyticsEvent} The [AnalyticsEvent]{@link AnalyticsEvent} instance that was logged.
     * @function
     * @name Analytics#logNamedEvent
     * @mcs
     */
    Analytics.prototype.logNamedEvent = function (name) {
        var event = new analytics_event_1.AnalyticsEvent(name);
        this.logEvent(event);
        return event;
    };
    /**
     * Writes out an analytics event. It will implicitly call startSession(),
     * which will add a new event to the list of events for Oracle Mobile Cloud Enterprise to consume
     * @param event {AnalyticsEvent} The event to log.
     * @example event: "GettingStartedJSEvent"
     * @returns {AnalyticsEvent} The [AnalyticsEvent]{@link AnalyticsEvent} instance that was logged.
     * @function
     * @name Analytics#logEvent
     * @mcs
     */
    Analytics.prototype.logEvent = function (event) {
        if (this.events.length === 0) {
            this.events[0] = this._createContextEvent();
        }
        this.startSession();
        this.events[this.events.length] = event;
        event.sessionID = this.sessionId;
        return event;
    };
    /**
     * Uploads all events to the service if the device is online or caches them locally until the device goes online, at
     * which point they will be uploaded. If a session is in progress it will end.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name Analytics#flush
     * @mcs
     */
    Analytics.prototype.flush = function (_location) {
        for (var i = 0; i < this.events.length; i++) {
            // 01/30/2019 -- Mayur Varshney -- passing custom location in analytics , getting from User table
            if (this.events[i].name == "context") {
              this.events[i].properties.locality = _location.locality ? _location.locality : '';
              this.events[i].properties.region = _location.region ? _location.region : '';
              this.events[i].properties.postalCode = _location.postalCode ? _location.postalCode : '';
              this.events[i].properties.country = _location.country ? _location.country : '';
            }
        }
        var eventsString = JSON.stringify(this.events);
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.APPLICATION_JSON);
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.POST,
            url: this.backend.getPlatformUrl('analytics/events'),
            data: eventsString,
            module: types_1.ModuleNames.MCS_ANALYTICS,
        }).then(invokeServiceSuccess.bind(this), invokeServiceError.bind(this));
        function invokeServiceSuccess(response) {
            this.logger.debug('Analytics events flushed.');
            this.events = [];
            return response;
        }
        function invokeServiceError(response) {
            this.logger.error('Failed to flush analytics events.');
            return Promise.reject(response);
        }
    };

    Analytics.prototype._createContextEvent = function () {
        var contextEvent = new analytics_event_1.AnalyticsEvent('context');
        contextEvent.type = 'system';
        contextEvent.sessionID = this.sessionId;
        contextEvent.properties.timezone = '' + new Date().getTimezoneOffset() * 60;
        var deviceInformation = this.platform.getDeviceInformation();
        contextEvent.properties.model = deviceInformation.model;
        contextEvent.properties.manufacturer = deviceInformation.manufacturer;
        contextEvent.properties.osName = deviceInformation.osName;
        contextEvent.properties.osVersion = deviceInformation.osVersion;
        contextEvent.properties.osBuild = deviceInformation.osBuild;
        contextEvent.properties.carrier = deviceInformation.carrier;
        return contextEvent;
    };
    Analytics.prototype._getEvents = function () {
        return this.events;
    };
    Analytics.prototype._locationEnabled = function () {
        if (typeof this.config.disableAnalyticsLocation !== 'undefined') {
            return this.config.disableAnalyticsLocation;
        }
        else {
            return true;
        }
    };
    return Analytics;
}());
exports.Analytics = Analytics;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 * Created by ddrobins on 7/28/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var network_response_1 = __webpack_require__(2);
var types_1 = __webpack_require__(0);
/**
 * @classdesc This class provides a way to invoke custom API endpoints for the
 * currently active mobile backend. Callers should use
 * MobileBackend's [customCode]{@link Backend#customCode} property.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var CustomCode = /** @class */ (function () {
    function CustomCode(backend, platform) {
        this.backend = backend;
        this.platform = platform;
        this.accsheader;
    }

    CustomCode.prototype.setAccsHeaderValue = function(header) {
      this.accsheader = header;
    }

    /**
     * Invoke custom code JSON request.
     * Allows the user to call custom Code defined on the UI and assigned to the backend defined by the user
     * This custom endpoint should return data only in JSON format.
     * @function
     * @name CustomCode#invokeCustomCodeJSONRequest
     * @param path {String} The path of the endpoint without platform prefix.
     * @param method {String} HTTP method that is invoked, this method accepts: GET, POST, PUT, DELETE, PATCH.
     * @param data {Object} Data that is inserted into the call on the server for POST and PUT methods.
     * Only accepts a JSON object and/or JavaScript array.
     * @return {Promise<NetworkResponse>}
     * @example <caption>These methods must be defined in the custom API for these methods to work.<br/>
     * Example usage of CustomCode.invokeCustomCodeJSONRequest()</caption>
     * mcs.mobileBackend.customCode
     * .invokeCustomCodeJSONRequest('TaskApi1/tasks/100', 'GET', null)
     * .then(invokeSuccess, invokeError);
  
     * function invokeSuccess(response) {
     *  console.log(response.data);// returns object in JSON format
     * }
     * function invokeError(response) {
     *  console.error(response);
     * }
     * @mcs
     */
    CustomCode.prototype.invokeCustomCodeJSONRequest = function (path, method, data) {
        if (method in CustomCode.httpMethods) {
            if (method === CustomCode.httpMethods.DELETE && data) {
                return Promise.reject(new network_response_1.NetworkResponse(500, 'DELETE method content body'));
            }
            var headers = this.backend.getHttpHeaders();
            headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.APPLICATION_JSON);
            headers.add(types_1.Headers.ACCS_TOKEN, this.accsheader);
            var customData = data ? JSON.stringify(data) : null;
            return this.platform.invokeService({
                method: method,
                headers: headers,
                url: this.backend.getCustomCodeUrl(path),
                data: customData,
                module: types_1.ModuleNames.CUSTOM_CODE,
            });
        }
        else {
            return Promise.reject(new network_response_1.NetworkResponse(501, 'Method Not Implemented'));
        }
    };
    CustomCode.httpMethods = { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', PATCH: 'PATCH' };
    return CustomCode;
}());
exports.CustomCode = CustomCode;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var dictionary_1 = __webpack_require__(3);
var types_1 = __webpack_require__(0);
/**
 * @classdesc Class that provides diagnostics capabilities. Callers should use
 * MobileBackend's [diagnostics]{@link Backend#diagnostics} property.
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var Diagnostics = /** @class */ (function () {
    function Diagnostics(platform, utils) {
        this.platform = platform;
        this.logger = new logger_1.Logger('Diagnostics');
        this._sessionId = utils.uuid();
    }
    Diagnostics.prototype._getHttpHeaders = function (headers) {
        if (headers === void 0) { headers = new dictionary_1.Dictionary([]); }
        headers.add(types_1.Headers.ORACLE_MOBILE_DIAGNOSTIC_SESSION_ID, this.getSessionId());
        headers.add(types_1.Headers.ORACLE_MOBILE_DEVICE_ID, this.platform.getDeviceId());
        headers.add(types_1.Headers.ORACLE_MOBILE_CLIENT_REQUEST_TIME, new Date().toISOString());
        return headers;
    };
    /**
     * Get diagnostic session id.
     * Returns the session ID or process ID of the Diagnostics event.
     * @function
     * @name Diagnostics#getSessionId
     * @return {String} process id for the Diagnostics session.
     * @mcs
     */
    Diagnostics.prototype.getSessionId = function () {
        return this._sessionId;
    };
    return Diagnostics;
}());
exports.Diagnostics = Diagnostics;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var diagnostics_1 = __webpack_require__(39);
var custom_code_1 = __webpack_require__(38);
var analytics_1 = __webpack_require__(37);
var basic_authorization_1 = __webpack_require__(36);
var oauth_authorization_1 = __webpack_require__(34);
var synchronization_1 = __webpack_require__(33);
var storage_1 = __webpack_require__(24);
var types_1 = __webpack_require__(0);
var dictionary_1 = __webpack_require__(3);
/**
 * @classdesc Represents a mobile backend in Oracle Mobile Cloud Enterprise
 * and provides access to all capabilities of the backend.
 * Callers should use [mcs's mobileBackend]{@link mcs#mobileBackend} property...
 * @class
 * @global
 * @hideconstructor
 * @mcs
 */
var Backend = /** @class */ (function () {
    /**
     * Creates mobile backend object.
     * @protected
     * @param config {IOracleMobileCloudConfigInternal}
     * @param platform {IPlatform}
     * @param utils {IUtils}
     * @param syncExpress {ISyncExpressInternal}
     * @private
     */
    function Backend(config, platform, utils, syncExpress) {
        this.config = config;
        this.platform = platform;
        this.utils = utils;
        this.syncExpress = syncExpress;
        this.PLATFORM_PATH = 'mobile/platform';
        this.CUSTOM_CODE_PATH = 'mobile/custom';
        this._authenticationType = null;
        this._logger = new logger_1.Logger('MobileBackend');
        /**
         * The name of the MobileBackend as read from the configuration.
         * @type {string}
         * @name Backend#name
         * @readonly
         * @mcs
         */
        this.name = null;
        /**
         * Returns the Authorization object used to authorize a mobile user
         * against Oracle Mobile Cloud Enterprise.
         * Please use {@link mcs#mobileBackend#setAuthenticationType} to initialize this property.<br/>
         * @readonly
         * @type {Authorization}
         * @name Backend#authorization
         * @mcs
         */
        this.authorization = null;
        /**
         * Get diagnostic object.
         * Returns the Diagnostics object that enables end-end debugging across application and cloud.
         * @readonly
         * @type {Diagnostics}
         * @name Backend#diagnostics
         * @mcs
         */
        this.diagnostics = null;
        /**
         * Returns the CustomCode object that enables calls to custom APIs.
         * @readonly
         * @type {CustomCode}
         * @name Backend#customCode
         * @mcs
         */
        this.customCode = null;
        /**
         * Returns the Analytics object that enables capture of mobile analytics events.
         * @readonly
         * @type {Analytics}
         * @name Backend#analytics
         * @mcs
         */
        this.analytics = null;
        /**
         * Returns the Storage object that provides cloud-based object storage capabilities.
         * @readonly
         * @type {Storage}
         * @name Backend#storage
         * @mcs
         */
        this.storage = null;
        /**
         * Returns the Synchronization object that provides caching and synchronization capabilities.
         * @readonly
         * @type {Synchronization}
         * @name Backend#synchronization
         * @mcs
         */
        this.synchronization = null;
        /**
         * Returns an instance of the application configuration object.
         * Callers can download the configuration from the service by invoking loadAppConfig().
         * @readonly
         * @type {object}
         * @name Backend#appConfig
         * @mcs
         */
        this.appConfig = {};
        this._mbeConfig = config.mobileBackend;
        this.name = this._mbeConfig.name;
        this.diagnostics = new diagnostics_1.Diagnostics(platform, utils);
        this.customCode = new custom_code_1.CustomCode(this, platform);
        this.analytics = new analytics_1.Analytics(config, this, platform, utils);
        this.storage = new storage_1.Storage(this, utils, platform);
        this._baseUrl = utils.validateConfiguration(this._mbeConfig.baseUrl);
        this._authenticationTypes = Object.assign({}, types_1.AuthenticationTypes, 
        { facebook: undefined, token: undefined });
        console.log('constructor', JSON.stringify(this._authenticationTypes));
        if (syncExpress) {
            this.synchronization = new synchronization_1.Synchronization(this, utils, platform, syncExpress.common, syncExpress.options, syncExpress.process);
        }
        if (this._mbeConfig.authentication.type) {
            this.setAuthenticationType(this._mbeConfig.authentication.type);
        }
    }
    /**
     * Constructs a full URL by pre-pending the prefix for platform API REST endpoints
     * to the given endpoint path.
     * @function
     * @name Backend#getPlatformUrl
     * @param path {string} The relative path of the endpoint following the platform prefix,
     * i.e. /mobile/platform.
     * @returns {string} The full URL.
     * @mcs
     */
    Backend.prototype.getPlatformUrl = function (path) {
        var url = this._baseUrl;
        if (this._authenticationType === types_1.AuthenticationTypes.oauth &&
            this.utils.strEndsWith(this._baseUrl, '1')) {
            url = url.substring(0, url.length - 4) + '7777';
        }
        url = this.utils.validateConfiguration(url) + '/' + this.PLATFORM_PATH;
        if (!this.utils.strEndsWith(url, '/')) {
            url += '/';
        }
        return url + path;
    };
    /**
     * Constructs a full URL by prepending the prefix for custom API REST endpoints
     * to the given endpoint path.
     * @function
     * @name Backend#getCustomCodeUrl
     * @param path {string} The relative path of the endpoint following the platform prefix,
     * i.e. {BaseUrl}/mobile/custom.
     * @returns {string} The full URL.
     * @mcs
     */
    Backend.prototype.getCustomCodeUrl = function (path) {
        return this.utils.validateConfiguration(this._baseUrl) + this._getCustomCodeUri(path);
    };
    /**
     * Populates auth and diagnostics HTTP headers for making REST calls to a mobile backend.
     * @function
     * @name Backend#getHttpHeaders
     * @param [headers] {Headers} An optional object with which to populate with the headers.
     * @returns {Headers} The headers parameter that is passed in.
     * If not provided, a new object with the populated headers
     * as properties of that object is created.
     * @mcs
     */
    Backend.prototype.getHttpHeaders = function (headers) {
        if (headers === void 0) { headers = new dictionary_1.Dictionary([]); }
        var authorization = this.authorization;
        var newHeaders = this.diagnostics._getHttpHeaders(headers);
        if (authorization) {
            if (authorization._getIsAuthorized() && authorization._getIsAnonymous()) {
                newHeaders = authorization._getAnonymousHttpHeaders(newHeaders);
            }
            else {
                newHeaders = authorization._getHttpHeaders(newHeaders);
            }
        }
        return newHeaders;
    };
    /**
     * Use this method to retrieve current authentication type.
     * @function
     * @name Backend#getAuthenticationType
     * @return {string} Authentication type
     * @mcs
     */
    Backend.prototype.getAuthenticationType = function () {
        return this._authenticationType;
    };
    /**
     * Initialize and returns the Authorization object
     * that provides authorization capabilities and access to user properties.
     * @function
     * @name Backend#setAuthenticationType
     * @param {string} type
     * For [Basic authentication]{@link BasicAuthorization},
     * you would specify "basic" to use the Basic Authentication security schema.<br/>
     * For [OAuth authentication]{@link OAuthAuthorization},
     * you would specify "oauth" to use OAuth Authentication security schema.<br/>
     * @return {Authorization}
     * @throws When unrecognized authentication type provided,
     * this method will throw an Exception stating that the type of Authentication that you provided
     * is not supported at this time.
     * @example <caption>Example usage of mobileBackend.setAuthenticationType()</caption>
     * // Basic Authorization schema
     * mcs.mobileBackend.setAuthenticationType('basic');
     * @example // OAuth Authorization schema
     * mcs.mobileBackend.setAuthenticationType('oauth');
     * @mcs:web
     */
    Backend.prototype.setAuthenticationType = function (type) {
        var authType = this.utils.validateConfiguration(type);
        this.authorization = null;
        if (!this._authenticationTypes[authType]) {
            throw Error("Wrong Authentication type: " + type + ", please use one of: \n" +
                this._getAuthenticationTypesMessage(this._authenticationTypes));
        }
        if (!this._mbeConfig.authentication[authType]) {
            throw Error("No Authentication Type called " + type + " is defined in configuration \n" +
                'check configuration in authorization object for the following objects:\n' +
                this._getAuthenticationTypesMessage(this._authenticationTypes));
        }
        if (this.authorization && this.authorization._getIsAuthorized()) {
            this.authorization.logout();
        }
        if (authType === types_1.AuthenticationTypes.basic) {
            this.authorization = new basic_authorization_1.BasicAuthorization(this._mbeConfig.authentication.basic, this, this.utils, this.platform);
            this._logger.info('Your Authentication type: ' + authType);
            this._authenticationType = authType;
        }
        else if (authType === types_1.AuthenticationTypes.oauth) {
            var mbeConfigInternal = this._mbeConfig;
            this.authorization = new oauth_authorization_1.OAuthAuthorization(this.config.oAuthTokenEndPoint, this._mbeConfig.authentication.oauth, this, mbeConfigInternal.tenantId, this.utils, this.platform);
            this._logger.info('Your Authentication type: ' + authType);
            this._authenticationType = authType;
        }
        return this.authorization;
    };
    /**
     * Downloads the configuration from the service.
     * The AppConfig property will contain the downloaded configuration.
     * @function
     * @memberOf Backend
     * @name Backend#loadAppConfig
     * @return {Promise<NetworkResponse>}
     * @mcs
     */
    Backend.prototype.loadAppConfig = function () {
        var headers = this.getHttpHeaders();
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.APPLICATION_JSON);
        var authorizationInternal = this.authorization;
        if (!authorizationInternal._getIsAuthorized()) {
            headers = authorizationInternal._getAnonymousAuthorizationHeaders(headers);
        }
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.GET,
            url: this.getPlatformUrl('appconfig/client'),
            module: types_1.ModuleNames.APP_CONFIG,
        }).catch(invokeServiceFail.bind(this));
        function invokeServiceFail(response) {
            this.logger.error('App config download failed! with status code: ' + response.statusCode);
            return Promise.reject(response);
        }
    };
    Backend.prototype._getCustomCodeUri = function (path) {
        var url = '/' + this.CUSTOM_CODE_PATH;
        var newPath = path;
        if (this.utils.strEndsWith(newPath, '/')) {
            newPath = newPath.slice(0, -1);
        }
        return url + '/' + newPath;
    };
    Backend.prototype._getAuthenticationTypesMessage = function (types) {
        var _this = this;
        return Object
            .keys(this._authenticationTypes)
            .filter(function (key) { return !!_this._authenticationTypes[key]; })
            .map(function (key) { return _this._authenticationTypes[key]; })
            .join('\n');
    };
    return Backend;
}());
exports.Backend = Backend;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 * @ignore
 */
exports.POLICIES_MAP = {
    fetchPolicy: {
        persistencePropertyName: 'fetchPolicy',
        FETCH_FROM_CACHE_SCHEDULE_REFRESH: 'FETCH_FROM_CACHE_SCHEDULE_REFRESH',
        FETCH_FROM_SERVICE_IF_ONLINE: 'FETCH_FROM_SERVICE_IF_ONLINE',
        FETCH_FROM_CACHE: 'FETCH_FROM_CACHE',
        FETCH_FROM_SERVICE: 'FETCH_FROM_SERVICE',
        FETCH_FROM_SERVICE_ON_CACHE_MISS: 'FETCH_FROM_SERVICE_ON_CACHE_MISS',
        FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY: 'FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY',
        FETCH_WITH_REFRESH: 'FETCH_WITH_REFRESH'
    },
    evictionPolicy: {
        persistencePropertyName: 'evictionPolicy',
        EVICT_ON_EXPIRY_AT_STARTUP: 'EVICT_ON_EXPIRY_AT_STARTUP',
        MANUAL_EVICTION: 'MANUAL_EVICTION'
    },
    expirationPolicy: {
        persistencePropertyName: 'expirationPolicy',
        EXPIRE_ON_RESTART: 'EXPIRE_ON_RESTART',
        EXPIRE_AFTER: 'EXPIRE_AFTER',
        NEVER_EXPIRE: 'NEVER_EXPIRE'
    },
    updatePolicy: {
        persistencePropertyName: 'updatePolicy',
        QUEUE_IF_OFFLINE: 'QUEUE_IF_OFFLINE',
        UPDATE_IF_ONLINE: 'UPDATE_IF_ONLINE'
    },
    refreshPolicy: {
        persistencePropertyName: 'refreshPolicy',
        PeriodicallyRefreshExpiredResource: ''
    },
    conflictResolutionPolicy: {
        persistencePropertyName: 'conflictResolutionPolicy',
        SERVER_WINS: 'SERVER_WINS',
        PRESERVE_CONFLICT: 'PRESERVE_CONFLICT',
        CLIENT_WINS: 'CLIENT_WINS'
    },
    noCache: {
        persistencePropertyName: 'noCache',
        'false': false,
        'true': true
    }
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.removeSpace = function (input) {
        return input.replace(/ /g, '');
    };
    Utils.prototype.uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    Utils.prototype.validateConfiguration = function (input) {
        var prop = input;
        if (/\s/.test(prop) && prop) {
            prop = this.removeSpace(input);
        }
        return prop;
    };
    Utils.prototype.encodeBase64 = function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                Utils.KEY_STR.charAt(enc1) +
                Utils.KEY_STR.charAt(enc2) +
                Utils.KEY_STR.charAt(enc3) +
                Utils.KEY_STR.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
    };
    Utils.prototype.decodeBase64 = function (input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            return null;
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
            enc1 = Utils.KEY_STR.indexOf(input.charAt(i++));
            enc2 = Utils.KEY_STR.indexOf(input.charAt(i++));
            enc3 = Utils.KEY_STR.indexOf(input.charAt(i++));
            enc4 = Utils.KEY_STR.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        } while (i < input.length);
        return output;
    };
    Utils.prototype.clearNonPrintableCharacters = function (str) {
        return str.replace(Utils.SPECIAL_CHAR_RGX, '');
    };
    Utils.prototype.hasValue = function (obj, key, value) {
        return obj.hasOwnProperty(key) && obj[key] === value;
    };
    Utils.prototype.isEquivalentURL = function (url1, url2) {
        if (url1.indexOf("https") === 0 && url2.indexOf("https") === 0) {
            url1 = this.getPort(url1) === 443 ? url1.replace(':443', '') : url1;
            url2 = this.getPort(url2) === 443 ? url2.replace(':443', '') : url2;
        }
        else if (url1.indexOf("https") === -1 && url2.indexOf("https") === -1) {
            url1 = this.getPort(url1) === 80 ? url1.replace(':80', '') : url1;
            url2 = this.getPort(url2) === 80 ? url2.replace(':80', '') : url2;
        }
        return url1.indexOf(url2) === 0;
    };
    Utils.prototype.getPort = function (url) {
        var colonIdx = url.indexOf(':', 7);
        var slashIdx = url.indexOf('/', colonIdx);
        if (colonIdx > 0 && slashIdx == -1) {
            slashIdx = url.length;
        }
        var port = url.substr(colonIdx + 1, slashIdx - colonIdx - 1);
        if (port && !isNaN(port * 1)) {
            return port * 1;
        }
        else {
            return -1;
        }
    };
    /**
     * Convert headers string to dictionary with lowercase keys.
     * @param {string} headerStr
     * @return {object}
     */
    Utils.prototype.parseHeaders = function (headerStr) {
        var headers = {};
        if (!headerStr) {
            return headers;
        }
        var headerPairs = headerStr.split('\u000d\u000a');
        for (var i = 0, ilen = headerPairs.length; i < ilen; i++) {
            var headerPair = headerPairs[i];
            var index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                headers[headerPair.substring(0, index).toLowerCase()] = headerPair.substring(index + 2);
            }
        }
        return headers;
    };
    Utils.prototype.normalizeHeaderKeys = function (responseHeaders) {
        var headers = {};
        if (this.isArray(responseHeaders)) {
            var array = responseHeaders;
            for (var i = 0; i < array.length; i++) {
                headers[array[i].name.toLowerCase()] = array[i].value;
            }
        }
        else {
            for (var key in responseHeaders) {
                if (responseHeaders.hasOwnProperty(key)) {
                    headers[key.toLowerCase()] = responseHeaders[key];
                }
            }
        }
        return headers;
    };
    ;
    Utils.prototype.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    ;
    Utils.prototype.isCordova = function () {
        return typeof window['cordova'] !== 'undefined';
    };
    /**
     * Checks to see if the string ends with a suffix.
     * @return {boolean}
     */
    Utils.prototype.strEndsWith = function (str, suffix) {
        return str.endsWith(suffix);
    };
    Utils.prototype.hashCode = function (input) {
        return input
            .split('')
            .reduce(function (acc, char) {
            acc = ((acc << 5) - acc) + char.charCodeAt(0);
            return acc & acc;
        }, 0);
    };
    Utils.KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    Utils.SPECIAL_CHAR_RGX = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
    return Utils;
}());
exports.Utils = Utils;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(42);
var logger_1 = __webpack_require__(1);
var analytics_event_1 = __webpack_require__(18);
var storage_object_1 = __webpack_require__(17);
var polices_map_1 = __webpack_require__(41);
var types = __webpack_require__(0);
/**
 * Headers dictionary.
 * The dictionary has lowercase header as a key and a header value as a value.
 * @typedef {Object<string, string>} NetworkResponseHeaders
 * @mcs
 */
/**
 * Headers dictionary.
 * The dictionary has header as a key and a header value as a value.
 * @typedef {Object<string, string>} Headers
 * @mcs
 */
/**
 * Oracle mobile configuration.
 * @typedef {object} OracleMobileCloudConfig
 * @property [logLevel] {mcs.LOG_LEVEL} Log level for mcs logger.
 * @property [logHTTP] {boolean} Include http headers and requests in log
 * @property oAuthTokenEndPoint {string} OAuth token endpoint for OAth authentication
 * @property [mobileBackend] {MobileBackendConfig} Mobile backend configuration
 * @property [sync] {SyncConfig} Configuration for mcs synchronization
 * Can't be combined with syncExpress configuration
 * @property [syncExpress] {SyncExpressConfig} Configuration for sync express
 * Can't be combined with sync configuration
 * @property [disableAnalyticsLocation] {boolean} Disable logging location by legacy analytics
 * @mcs
 */
/**
 * Oracle analytics authentication configuration.
 * @typedef {object} AnalyticsAuthentication
 * @property oauth {OAuthConfig} Analytics notification profile name for android
 * @mcs
 */
/**
 * Oracle sync configuration.
 * @typedef {object} SyncConfig
 * @property periodicRefreshPolicy {string} Synchronization periodic refresh policy
 * 'PERIODIC_REFRESH_POLICY_REFRESH_NONE'
 * 'PERIODIC_REFRESH_POLICY_REFRESH_EXPIRED_ITEM_ON_STARTUP'
 * 'PERIODIC_REFRESH_POLICY_PERIODICALLY_REFRESH_EXPIRED_ITEMS'
 * @property policies {PolicesConfig[]} Polices per endpoint
 * @mcs
 */
/**
 * Oracle sync express configuration.
 * @typedef {object} SyncExpressConfig
 * @property [handler] {string} Handler type to process requests
 * OracleRestHandler - for oracle rest endpoints
 * GenericRequestHandler - for simple rest endpoints, default value
 * @property policies {PolicesConfig[]} Polices per endpoint
 * @mcs
 */
/**
 * Oracle sync policies configuration.
 * @typedef {object} PolicesConfig
 * @property path {string} Path for the endpoint
 * @property fetchPolicy {string} Fetch policy for current path
 * 'FETCH_FROM_CACHE_SCHEDULE_REFRESH'
 * 'FETCH_FROM_SERVICE_IF_ONLINE'
 * 'FETCH_FROM_SERVICE'
 * @mcs
 */
/**
 * Oracle mobile backend configuration.
 * @typedef {object} MobileBackendConfig
 * @property baseUrl {string} Base url for the backend and analytics
 * @property name {string} Mobile backend name
 * @property authentication {AuthenticationConfig} Backend authorization's configuration
 * @mcs
 */
/**
 * Oracle mobile authentication configuration.
 * @typedef {object} AuthenticationConfig
 * @property [type] {string} Authentication default type: basic, oath, facebook, token
 * @property [basic] {BasicAuthConfig} Basic authentication configuration
 * @property [oauth] {OAuthConfig} OAuth authentication configuration
 * @mcs:web
 */
/**
 * Oracle mobile authentication configuration.
 * @typedef {object} AuthenticationConfig
 * @property [type] {string} Authentication default type: basic, oath, facebook, token
 * @property [basic] {BasicAuthConfig} Basic authentication configuration
 * @property [oauth] {OAuthConfig} OAuth authentication configuration
 * @property [facebook] {FacebookAuthConfig} OAuth authentication configuration
 * @property [token] {TokenExchangeAuthConfig} OAuth authentication configuration
 * @mcs:cordova
 */
/**
 * Oracle mobile basic authentication configuration.
 * @typedef {object} BasicAuthConfig
 * @property mobileBackendId {string} Mobile backend identifier
 * @property anonymousKey {string} Anonymous key for anonymous authentication
 * @mcs
 */
/**
 * Oracle mobile oauth authentication configuration.
 * @typedef {object} OAuthConfig
 * @property clientId {string} OAuth client identifier
 * @property clientSecret {string} OAuth client secret key
 * @mcs
 */
/**
 * Oracle mobile facebook authentication configuration.
 * @typedef {object} FacebookAuthConfig
 * @property appId {string} Facebook application identifier
 * @property anonymousKey {string} Anonymous key for anonymous authentication
 * @property mobileBackendId {string} Mobile backend identifier
 * @property scopes {string} Facebook authentication access types:
 * public_profile,user_friends,email,user_location,user_birthday
 * @mcs:cordova
 */
/**
 * Oracle mobile facebook authentication configuration.
 * @typedef {object} TokenExchangeAuthConfig
 * @property mobileBackendId {string} Mobile backend identifier
 * @property anonymousKey {string} Anonymous key for anonymous authentication
 * @property clientId {string} OAuth client identifier
 * @property clientSecret {string} OAuth client secret key
 * @mcs:cordova
 */
/**
 * MCS module.
 * @global
 * @namespace mcs
 * @private
 * @mcs
 */
var MCSModule = /** @class */ (function () {
    function MCSModule(cxa, _global, sync) {
        if (sync === void 0) { sync = null; }
        this.cxa = cxa;
        this._global = _global;
        this._logger = new logger_1.Logger('MCS');
        this._utils = new utils_1.Utils();
        /**
         * Log levels enum.
         * @name LOG_LEVEL
         * @enum {number}
         * @memberof mcs
         * @readonly
         * @property {number} NONE 0
         * @property {number} ERROR 1
         * @property {number} WARN 2
         * @property {number} INFO 3
         * @property {number} DEBUG 4
         * @mcs
         */
        this.LOG_LEVEL = logger_1.Logger.LOG_LEVEL;
        /**
         * Authentication types enum.
         * @name AUTHENTICATION_TYPES
         * @enum {string}
         * @memberof mcs
         * @readonly
         * @instance
         * @property {string} basic 'basic'
         * @property {string} oauth 'oauth'
         * @mcs:web
         */
        /**
         * Authentication types enum.
         * @name AUTHENTICATION_TYPES
         * @enum {string}
         * @memberof mcs
         * @readonly
         * @instance
         * @property {string} basic 'basic'
         * @property {string} oauth 'oauth'
         * @property {string} facebook 'facebook'
         * @property {string} token 'token'
         * @mcs:cordova
         */
        this.AUTHENTICATION_TYPES = types.AuthenticationTypes;
        /**
         * Request response types enum.
         * @name RESPONSE_TYPES
         * @enum {string}
         * @memberof mcs
         * @readonly
         * @instance
         * @property {string} JSON 'json'
         * @property {string} BLOB 'blob'
         * @property {string} ARRAY_BUFFER 'arraybuffer'
         * @property {string} DOCUMENT 'document'
         * @property {string} TEXT 'text'
         * @mcs:web
         */
        this.RESPONSE_TYPES = types.XMLHttpRequestResponseTypes;
        /**
         * Http methods enum.
         * @name HTTP_METHODS
         * @enum {string}
         * @memberof mcs
         * @readonly
         * @instance
         * @property {string} GET 'GET'
         * @property {string} PUT 'PUT'
         * @property {string} PATCH 'PATCH'
         * @property {string} POST 'POST'
         * @property {string} DELETE 'DELETE'
         * @property {string} HEAD 'HEAD'
         * @mcs:web
         */
        this.HTTP_METHODS = types.HttpMethods;
        /**
         * Notification providers.
         * @name NOTIFICATION_PROVIDERS
         * @enum {string}
         * @memberof mcs
         * @readonly
         * @instance
         * @property {string} FCM 'FCM'
         * @property {string} APNS 'APNS'
         * @property {string} WNS 'WNS'
         * @property {string} SYNIVERSE 'SYNIVERSE'
         * @mcs:cordova
         * @mcs:react-native
         */
        this.NOTIFICATION_PROVIDERS = types.NotificationProviders;
        /**
         * Get list of latest log entries.
         * @return {Array} - last log entries
         * @private
         * @ignore
         */
        this._getLogHistory = function () { return logger_1.Logger.history; };
        /**
         * Storage object constructor.
         * Access point to class that represents a storage object resource that can be used to store data.
         * @function
         * @name mcs.StorageObject
         * @memberOf mcs
         * @param storageCollection {StorageCollection}
         * @param [json] {Object} Json storage object representation
         * @returns {StorageObject}
         * @mcs
         */
        this.StorageObject = storage_object_1.StorageObject;
        /**
         * Analytics event constructor.
         * Creates analytics event.
         * @function
         * @name mcs.AnalyticsEvent
         * @memberOf mcs
         * @param {string} name - event name
         * @type {AnalyticsEvent}
         * @mcs
         */
        this.AnalyticsEvent = analytics_event_1.AnalyticsEvent;
        this._syncExpress = sync || (typeof _global.mcs !== 'undefined' ? _global.mcs.sync : null);
    }
    MCSModule.prototype._init = function (config) {
        this._config = Object.assign({
            mcsVersion: '18.3.3.0',
        }, config);
        if (typeof config.logLevel !== 'undefined') {
            logger_1.Logger.logLevel = config.logLevel;
        }
        else {
            logger_1.Logger.logLevel = this.LOG_LEVEL.NONE;
        }
        var internalConfig = this._config;
        this._logger.debug('MCS initialization, version', internalConfig.mcsVersion);
        if (typeof internalConfig.logHistoryEnabled !== 'undefined') {
            logger_1.Logger.historyEnabled = internalConfig.logHistoryEnabled;
        }
        if (typeof internalConfig.logHistorySize !== 'undefined') {
            logger_1.Logger.historySize = internalConfig.logHistorySize;
        }
        if (typeof internalConfig.mcsGlobal !== 'undefined' && internalConfig.mcsGlobal) {
            this._global.mcs = Object.assign({}, this._global.mcs, this);
        }
        if (!!this._syncExpress) {
            this._initPersistenceConfiguration(config);
        }
        else if (config.sync || config.syncExpress) {
            this._logger.warn('Sync script was not included on page, switch caching off');
        }
        this._platform = this._getPlatform(this._config, this._utils);
    };
    MCSModule.prototype._initPersistenceConfiguration = function (config) {
        var syncExpress = this._syncExpress;
        syncExpress._setLogLevel(config.logLevel);
        syncExpress._setLogHTTP(config.logHTTP);
        var syncConfig = null;
        if (config.sync && config.syncExpress) {
            throw Error('Configuration contains two types synchronisation, ' +
                'please choose one of those types, switch caching off');
        }
        else if (config.sync) {
            syncConfig = config.sync;
            syncExpress.setHandler(syncExpress.SYNC_REQUEST_HANDLER_TYPE.MCS);
        }
        else if (config.syncExpress) {
            syncConfig = config.syncExpress;
            var isOracleRestHandler = config.syncExpress.handler &&
                config.syncExpress.handler === 'OracleRestHandler';
            syncExpress.setHandler(isOracleRestHandler ? syncExpress.SYNC_REQUEST_HANDLER_TYPE.ORACLE_REST :
                syncExpress.SYNC_REQUEST_HANDLER_TYPE.GENERIC);
        }
        else {
            this._logger.warn('Missing synchronization configuration, switch caching off');
            syncExpress.options.switchOff();
            return;
        }
        syncExpress.options.switchOff(false);
        var persistenceConfig = {
            default: {
                conflictResolutionPolicy: 'CLIENT_WINS',
                expirationPolicy: 'NEVER_EXPIRE',
                expireAfter: 600,
                evictionPolicy: 'MANUAL_EVICTION',
                fetchPolicy: 'FETCH_FROM_SERVICE_IF_ONLINE',
                updatePolicy: 'QUEUE_IF_OFFLINE',
                noCache: false,
            },
            periodicRefreshInterval: syncConfig.backgroundRefreshPolicy || 120,
            policies: [],
            periodicRefreshPolicy: null,
        };
        var mcsPolicies = syncConfig.policies;
        for (var idx in mcsPolicies) {
            if (mcsPolicies.hasOwnProperty(idx)) {
                var policy = mcsPolicies[idx];
                if (policy) {
                    persistenceConfig.policies.push(this._getPersistencePolicy(policy));
                }
                else {
                    this._logger.error('The ' + policy + 'policy was not found in accepted policies.');
                }
            }
        }
        syncExpress.options.setPolicies(persistenceConfig);
        syncExpress.options.dbFirst = false;
        syncExpress.options.setMaxSyncAttempts(1);
        syncExpress.options.setAutoRemoveAfterReachMaxAttempts(true);
    };
    MCSModule.prototype._getPersistencePolicy = function (mcsPolicy) {
        var policy = { path: mcsPolicy.path };
        for (var prop in mcsPolicy) {
            if (mcsPolicy.hasOwnProperty(prop) && prop !== 'path') {
                var persMap = polices_map_1.POLICIES_MAP[prop];
                if (!persMap) {
                    this._logger.error('The ' + prop + ' policy was not found in accepted policies.');
                }
                else if (persMap[mcsPolicy[prop]] === undefined) {
                    this._logger.error('The ' +
                        prop +
                        ' policy value ' +
                        mcsPolicy[prop] +
                        ' was not found in accepted policy values.');
                }
                else {
                    policy[persMap.persistencePropertyName] = persMap[mcsPolicy[prop]];
                }
            }
        }
        return policy;
    };
    return MCSModule;
}());
exports.MCSModule = MCSModule;


/***/ }),
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = __webpack_require__(21);
var logger_1 = __webpack_require__(1);
var types_1 = __webpack_require__(0);
/**
 * Platform class for browser applications.
 * @extends Platform
 * @private
 */
var BrowserPlatform = /** @class */ (function (_super) {
    __extends(BrowserPlatform, _super);
    function BrowserPlatform(config, utils, navigator, logger) {
        var _this = _super.call(this, config, utils, logger || new logger_1.Logger('BrowserPlatform')) || this;
        _this._navigator = navigator;
        _this.isBrowser = true;
        _this.isCordova = false;
        return _this;
    }
    BrowserPlatform.prototype.getDevicePlatform = function () {
        var userAgent = this._navigator.userAgent;
        if (userAgent.match(/Android/i)) {
            return types_1.DevicePlatforms.ANDROID;
        }
        if (userAgent.match(/iPad/i) ||
            userAgent.match(/iPod/i) ||
            userAgent.match(/iPhone/i)) {
            return types_1.DevicePlatforms.IOS;
        }
    };
    BrowserPlatform.prototype._getPlatform = function () {
        return types_1.PlatformNames.JAVASCRIPT;
    };
    return BrowserPlatform;
}(platform_1.Platform));
exports.BrowserPlatform = BrowserPlatform;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var authorization_1 = __webpack_require__(4);
var logger_1 = __webpack_require__(1);
var network_response_1 = __webpack_require__(2);
var mcs_authorization_1 = __webpack_require__(7);
var types_1 = __webpack_require__(0);
var dictionary_1 = __webpack_require__(3);
/**
 * @class
 * @global
 * @classdesc Class used to authorize a mobile user against Oracle Mobile Cloud Enterprise
 * with External Token Authentication security schema. Callers should use
 * MobileBackend's [authorization]{@link Backend#authorization} property.
 * @extends MCSAuthorization
 * @hideconstructor
 * @mcs
 */
var ExternalTokenExchangeAuthorization = /** @class */ (function (_super) {
    __extends(ExternalTokenExchangeAuthorization, _super);
    function ExternalTokenExchangeAuthorization(config, backend, utils, platform) {
        var _this = _super.call(this, backend, utils, platform) || this;
        _this.logger = new logger_1.Logger('ExternalTokenExchangeAuthorization');
        _this._backendId = utils.validateConfiguration(config.mobileBackendId);
        _this._anonymousToken = utils.validateConfiguration(config.anonymousKey);
        _this._clientId = utils.validateConfiguration(config.clientId);
        _this._clientSecret = utils.validateConfiguration(config.clientSecret);
        return _this;
    }
    /**
     * Authenticates.
     * Authenticates a user with the given external token. The user remains logged in until logout() is called.
     * @param token {String} The third party authentication token.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name ExternalTokenExchangeAuthorization#authenticate
     * @mcs
     */
    ExternalTokenExchangeAuthorization.prototype.authenticate = function () {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var token = params[0];
        if (!token || typeof token !== 'string' || token.length === 0) {
            this.logger.error('Wrong token parameter');
            return Promise.reject(new network_response_1.NetworkResponse(400, 'Bad Request'));
        }
        this.logout();
        this._redToken = token;
        var useOldAPI = false, useNewAPI = false;
        if (token.indexOf('.') === -1) {
            useOldAPI = true;
        }
        else {
            var audiences = this.getAudience(token);
            if (!audiences) {
                return Promise.reject(new network_response_1.NetworkResponse(400, 'Bad Request'));
            }
            for (var _a = 0, audiences_1 = audiences; _a < audiences_1.length; _a++) {
                var audience = audiences_1[_a];
                if (audience === this.backend.getPlatformUrl('sso') ||
                    audience === this.backend.getPlatformUrl('sso/exchange-token')) {
                    useOldAPI = true;
                }
                else if (audience === this.backend.getPlatformUrl('auth') ||
                    audience === this.backend.getPlatformUrl('auth/token')) {
                    useNewAPI = true;
                }
            }
        }
        console.log(useOldAPI, useNewAPI);
        if (useOldAPI && !useNewAPI) {
            return this.authenticateOldAPI(token)
                .then(invokeServiceSuccess.bind(this))
                .catch(invokeServiceError.bind(this));
        }
        else if (useNewAPI && !useOldAPI) {
            return this.authenticateNewAPI(token)
                .then(invokeServiceSuccess.bind(this))
                .catch(invokeServiceError.bind(this));
        }
        else {
            return this.authenticateOldAPI(token)
                .then(invokeServiceSuccess.bind(this))
                .catch(function (response) {
                if (response.statusCode === 0 || response.statusCode === 401) {
                    return _this.authenticateNewAPI(token);
                }
                else {
                    return Promise.reject(response);
                }
            })
                .then(invokeServiceSuccess.bind(this))
                .catch(invokeServiceError.bind(this));
        }
        function invokeServiceSuccess(response) {
            this._tokenExpiredTime = Date.now() + response.data.expires_in * 1000;
            this._authenticateSuccess(response, response.data.access_token);
            return new network_response_1.NetworkResponse(200, response.data);
        }
        function invokeServiceError(response) {
            this._authenticateError(response);
            return Promise.reject(response);
        }
    };
    ExternalTokenExchangeAuthorization.prototype.getAudience = function (token) {
        var audience;
        try {
            var base64BodyPart = token.split('.')[1];
            var bodyPart = this.utils.decodeBase64(base64BodyPart);
            bodyPart = this.utils.clearNonPrintableCharacters(bodyPart);
            var tokenBody = JSON.parse(bodyPart);
            audience = tokenBody['aud'];
            if (typeof audience === 'string') {
                audience = [audience];
            }
        }
        catch (error) {
            this.logger.error('Token has wrong format', error);
        }
        return audience;
    };
    ExternalTokenExchangeAuthorization.prototype.authenticateOldAPI = function (token) {
        console.log('authenticateOldAPI');
        var authorizationToken = 'Bearer ' + token;
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.AUTHORIZATION, authorizationToken);
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return this.platform.invokeService({
            headers: headers,
            url: this.backend.getPlatformUrl('sso/exchange-token?format=json'),
            method: types_1.HttpMethods.GET,
            module: types_1.ModuleNames.AUTHORIZATION,
        });
    };
    ExternalTokenExchangeAuthorization.prototype.authenticateNewAPI = function (token) {
        console.log('authenticateNewAPI');
        var authorizationToken = 'Basic ' + this.utils.encodeBase64(this._clientId + ':' + this._clientSecret);
        var data = this.getData(token);
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.AUTHORIZATION, authorizationToken);
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.X_WWW_FORM_FORM_URLENCODED);
        return this.platform.invokeService({
            headers: headers,
            data: data,
            url: this.backend.getPlatformUrl('auth/token'),
            method: types_1.HttpMethods.POST,
            module: types_1.ModuleNames.AUTHORIZATION,
        });
    };
    ExternalTokenExchangeAuthorization.prototype.getData = function (token) {
        return 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + encodeURIComponent(token);
    };
    /**
     * Authenticates anonymous.
     * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name ExternalTokenExchangeAuthorization#authenticateAnonymous
     * @mcs
     */
    ExternalTokenExchangeAuthorization.prototype.authenticateAnonymous = function () {
        return this._authenticateAnonymousInvoke(new dictionary_1.Dictionary([]), this.backend.getPlatformUrl('users/login'), types_1.HttpMethods.GET);
    };
    ExternalTokenExchangeAuthorization.prototype._getAnonymousAuthorizationHeaders = function (headers) {
        headers.add(types_1.Headers.AUTHORIZATION, 'Basic ' + this._anonymousToken);
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return headers;
    };
    /**
     * Is authentication token valid.
     * Checks to see if the OAuth token is null,undefined,NaN,empty string (''),0,false and also checks the timestamp
     * of when the token was first retrieved to see if it was still valid.
     * @returns {Boolean}
     * @function
     * @name ExternalTokenExchangeAuthorization#isTokenValid
     * @mcs
     */
    ExternalTokenExchangeAuthorization.prototype.isTokenValid = function () {
        if (this.getAccessToken() || this._getAnonymousAccessToken()) {
            this.logger.debug('Token is not null or empty');
            var currentTime = Date.now();
            if (currentTime >= this._tokenExpiredTime) {
                this.logger.info('Token has expired or user has not been authenticate with the service');
                return false;
            }
            else {
                this.logger.debug('Token is still valid');
                return true;
            }
        }
        else {
            return false;
        }
    };
    /**
     * Logs out the current user and clears credentials and tokens and cookies.
     * @function
     * @name ExternalTokenExchangeAuthorization#logout
     * @mcs
     */
    ExternalTokenExchangeAuthorization.prototype.logout = function () {
        this._redToken = null;
        this._clearState();
    };
    /**
     * Refreshes the authentication token if it has expired. The authentication scheme should support refresh.
     * @return {Promise<String>}
     * @function
     * @name ExternalTokenExchangeAuthorization#refreshToken
     * @mcs
     */
    ExternalTokenExchangeAuthorization.prototype.refreshToken = function () {
        var boolean = this.isTokenValid();
        if (boolean !== false) {
            if (this._accessToken == null && this._isAnonymous) {
                this.logger.error('Anonymous token is valid, you do not need to refresh.');
                return Promise.resolve(this._anonymousAccessToken);
            }
            if (!this._anonymousAccessToken && !this._isAnonymous) {
                this.logger.error('Authenticated token is valid, you do not need to refresh.');
                return Promise.resolve(this._accessToken);
            }
        }
        else {
            this.logger.error('Token is not valid and has expired, refreshing token from service.', this._redToken);
            return this.authenticate(this._redToken).then(function () {
                return this._accessToken;
            });
        }
    };
    ExternalTokenExchangeAuthorization.prototype._getHttpHeaders = function (headers) {
        if (this.getAccessToken() !== null && typeof this.getAccessToken() == 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, 'Bearer ' + this.getAccessToken());
        }
        return headers;
    };
    ExternalTokenExchangeAuthorization.prototype._getAnonymousHttpHeaders = function (headers) {
        if (this._getAnonymousAccessToken() && typeof this._getAnonymousAccessToken() == 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, 'Bearer ' + this._getAnonymousAccessToken());
        }
        return headers;
    };
    ExternalTokenExchangeAuthorization.prototype._anonymousTokenResponseConverter = function (response) {
        return new authorization_1.AuthenticationResponse(response, response.data.access_token);
    };
    return ExternalTokenExchangeAuthorization;
}(mcs_authorization_1.MCSAuthorization));
exports.ExternalTokenExchangeAuthorization = ExternalTokenExchangeAuthorization;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var authorization_1 = __webpack_require__(4);
var logger_1 = __webpack_require__(1);
var network_response_1 = __webpack_require__(2);
var mcs_authorization_1 = __webpack_require__(7);
var dictionary_1 = __webpack_require__(3);
var types_1 = __webpack_require__(0);
/**
 * @classdesc Class used to authorize a user against Facebook and use the OAuth token from Facebook
 * to authenticate against Oracle Mobile Cloud Enterprise. Callers should use
 * MobileBackend's [authorization]{@link Backend#authorization} property.
 * @class
 * @global
 * @extends MCSAuthorization
 * @hideconstructor
 * @mcs:cordova
 */
var FacebookAuthorization = /** @class */ (function (_super) {
    __extends(FacebookAuthorization, _super);
    function FacebookAuthorization(config, backend, utils, platform) {
        var _this = _super.call(this, backend, utils, platform) || this;
        _this.expiredTime = null;
        _this.logger = new logger_1.Logger('FacebookAuthorization');
        _this._backendId = utils.validateConfiguration(config.mobileBackendId);
        _this._anonymousToken = utils.validateConfiguration(config.anonymousKey);
        _this._facebookAppId = utils.validateConfiguration(config.appId);
        _this._scopes = utils.validateConfiguration(config.scopes);
        return _this;
    }
    /**
     * Get facebook application id.
     * Returns the Facebook Application Id token for the current backend.
     * @return {String}
     * @function
     * @name FacebookAuthorization#getFacebookAppId
     * @mcs
     */
    FacebookAuthorization.prototype.getFacebookAppId = function () {
        return this._facebookAppId;
    };
    /**
     * Authenticates a user against Facebook. The user remains logged in until logout() is called.
     * In the Facebook Developer console you must define the domain that the application will use.
     * in the Facebook Developer UI, When you add a platform for the application,
     * you choose Website and set the site URL to http://localhost/.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name FacebookAuthorization#authenticate
     * @mcs
     */
    FacebookAuthorization.prototype.authenticate = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.logout();
        if (typeof cordova !== 'undefined') {
            var metadata = cordova.require('cordova/plugin_list').metadata;
            if (this.isInAppBrowserInstalled(metadata) !== true) {
                return Promise.reject(new network_response_1.NetworkResponse(100, 'Could not find InAppBrowser plugin, use command "cordova plugin add cordova-plugin-inappbrowser"'));
            }
            else {
                return this._authenticateInvoke();
            }
        }
        else {
            return Promise.reject(new network_response_1.NetworkResponse(400, 'Bad Request - This method require Cordova framework'));
        }
    };
    FacebookAuthorization.prototype._authenticateInvoke = function () {
        return new Promise(invoke.bind(this))
            .then(invokeSuccess.bind(this))
            .catch(invokeError.bind(this));
        function invoke(resolve, reject) {
            var _this = this;
            var clientId = this.getFacebookAppId();
            var redirectUri = 'http://localhost/callback';
            var flowUrl =  true ? this.scopes : undefined;
            var browserRef = window.open(flowUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
            browserRef.show();
            this.logger.info('Opening InAppBrowser to url: ' + flowUrl);
            browserRef.addEventListener('loadstart', function (event) {
                if ((event.url).indexOf(redirectUri) === 0) {
                    browserRef.close();
                    var callbackResponse = (event.url).split('#')[1];
                    var responseParameters = (callbackResponse).split('&');
                    var socialToken = {};
                    for (var i = 0; i < responseParameters.length; i++) {
                        socialToken[responseParameters[i].split('=')[0]] = responseParameters[i].split('=')[1];
                    }
                    if (socialToken.access_token) {
                        _this.expiredTime = Date.now() + socialToken.expires_in * 1000;
                        resolve(new network_response_1.NetworkResponse(200, socialToken));
                    }
                    else {
                        if ((event.url).indexOf('error_code=100') !== 0 && !_this.isAuthorized) {
                            reject(new network_response_1.NetworkResponse(100, 'Cannot authenticate via a web browser'));
                        }
                    }
                }
            });
            browserRef.addEventListener('exit', function () {
                if (!_this._getIsAuthorized()) {
                    reject(new network_response_1.NetworkResponse(100, 'Cannot authenticate via a web browser'));
                }
            });
        }
        function invokeSuccess(response) {
            this._authenticateSuccess(response, response.data.access_token);
            this.expiredTime = Date.now() + response.data.expires_in * 1000;
            return response;
        }
        function invokeError(response) {
            this._authenticateError(response);
            return Promise.reject(response);
        }
    };
    /**
     * Authenticate anonymous.
     * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name FacebookAuthorization#authenticateAnonymous
     * @mcs
     */
    FacebookAuthorization.prototype.authenticateAnonymous = function () {
        return this._authenticateAnonymousInvoke(new dictionary_1.Dictionary([]), this.backend.getPlatformUrl('users/login'), types_1.HttpMethods.GET);
    };
    FacebookAuthorization.prototype._getAnonymousAuthorizationHeaders = function (headers) {
        headers.add(types_1.Headers.AUTHORIZATION, 'Basic ' + this._anonymousToken);
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return headers;
    };
    FacebookAuthorization.prototype._anonymousTokenResponseConverter = function (response) {
        return new authorization_1.AuthenticationResponse(response, 'Basic ' + this._anonymousToken);
    };
    /**
     * Checks to see if the OAuth token is null, undefined, NaN, AN empty string (''), 0, or false.
     * It also checks the timestamp
     * for when the token was first retrieved to see if it was still valid.
     * @returns {Boolean}
     * @function
     * @name FacebookAuthorization#isTokenValid
     * @mcs
     */
    FacebookAuthorization.prototype.isTokenValid = function () {
        if (this.getAccessToken() || this._getAnonymousAccessToken()) {
            this.logger.debug('Token is not null or empty');
            var currentTime = Date.now();
            if (currentTime >= this.expiredTime) {
                this.logger.info('Token has expired or user has not been authenticate with the service/Facebook');
                return false;
            }
            else {
                this.logger.debug('Token is still valid');
                return true;
            }
        }
        else {
            return false;
        }
    };
    /**
     * Refreshes the authentication token if it has expired from Facebook.
     * The authentication scheme should support refresh.
     * @return {Promise<NetworkResponse>}
     * @function
     * @name FacebookAuthorization#refreshToken
     * @mcs
     */
    FacebookAuthorization.prototype.refreshToken = function () {
        var isTokenValid = this.isTokenValid();
        if (isTokenValid && this.getAccessToken() == null && this._getIsAnonymous()) {
            return Promise.resolve(new network_response_1.NetworkResponse(200, this._getAnonymousAccessToken()));
        }
        else if (isTokenValid && this._getAnonymousAccessToken() && !this._getIsAnonymous()) {
            return Promise.resolve(new network_response_1.NetworkResponse(200, this._getAnonymousAccessToken()));
        }
        else {
            this.logger.error('Token is not valid and has expired, refreshing token from Facebook.');
            return this.authenticate();
        }
    };
    /**
     * Logs out the current user and clears credentials and tokens.
     * @function
     * @name FacebookAuthorization#logout
     * @mcs
     */
    FacebookAuthorization.prototype.logout = function () {
        this._clearState();
        this.expiredTime = Date.now() * 1000;
    };
    FacebookAuthorization.prototype._getHttpHeaders = function (headers) {
        if (this.getAccessToken() != null && typeof this.getAccessToken() == 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, 'Basic ' + this._anonymousToken);
            headers.add(types_1.Headers.ORACLE_MOBILE_SOCIAL_ACCESS_TOKEN, this.getAccessToken());
            headers.add(types_1.Headers.ORACLE_MOBILE_SOCIAL_IDENTITY_PROVIDER, 'facebook');
        }
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return headers;
    };
    FacebookAuthorization.prototype._getAnonymousHttpHeaders = function (headers) {
        if (this._getAnonymousAccessToken() && typeof this._getAnonymousAccessToken() == 'string') {
            headers.add(types_1.Headers.AUTHORIZATION, this._getAnonymousAccessToken());
        }
        headers.add(types_1.Headers.ORACLE_MOBILE_BACKEND_ID, this._backendId);
        return headers;
    };
    /**
     * Checks to see if the correct plugin is installed into the application.
     * @return {boolean}
     * @private
     */
    FacebookAuthorization.prototype.isInAppBrowserInstalled = function (metadata) {
        var inAppBrowserNames = ['cordova-plugin-inappbrowser', 'org.apache.cordova.inappbrowser'];
        return inAppBrowserNames.some(function (name) { return metadata.hasOwnProperty(name); });
    };
    return FacebookAuthorization;
}(mcs_authorization_1.MCSAuthorization));
exports.FacebookAuthorization = FacebookAuthorization;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var types_1 = __webpack_require__(0);
/**
 * @classdesc Class that provides notification capabilities. Callers should use
 * MobileBackend's [notifications]{@link Backend#notifications} property.
 * @class
 * @hideconstructor
 * @global
 * @mcs
 */
var Notifications = /** @class */ (function () {
    function Notifications(backend, platform) {
        this.backend = backend;
        this.platform = platform;
        this.logger = new logger_1.Logger('Notifications');
    }
    /**
     * Returns a string with device information used by [Notifications]{@link Notifications}
     * @function
     * @name Notifications#getDevicePlatform
     * @returns {String} The device specific information for platform.
     * @example : 'IOS', 'ANDROID'
     * @mcs
     */
    Notifications.prototype.getDevicePlatform = function () {
        return this.platform.getDevicePlatform().toUpperCase();
    };
    /**
     * Registers the current Cordova app running on the device for receiving push notifications.
     * @function
     * @name Notifications#registerForNotifications
     * @param deviceToken {String} Platform-specific device token.
     * @param packageName {String} Platform-specific application reverse domain identifier.
     * @param appVersion {String} Application version.
     * @param notificationProvider {String} The provider to register, possible values: 'APNS', 'FCM', 'WNS', 'SYNIVERSE'.
     * @return {Promise<NetworkResponse>}
     *
     * @example <caption>Example usage of mcs.mobileBackend.notifications.registerForNotifications()</caption>
     * mcs.mobileBackend
     *    .notifications
     *    .registerForNotifications('YOUR_DEVICE_TOKEN', 'com.yourcompany.project', '1.0.0', 'FCM')
     *    .then(registerSuccess)
     *    .catch(registerError);
     *
     * function registerSuccess(response){
     *    console.log(response);
     * }
     *
     * function registerError(response){
     *    console.error(response);
     * }
     * @mcs
     */
    Notifications.prototype.registerForNotifications = function (deviceToken, packageName, appVersion, notificationProvider) {
        if (!(notificationProvider in types_1.NotificationProviders)) {
            throw Error(this._getProviderError(notificationProvider));
        }
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.APPLICATION_JSON);
        var platform = this.platform.getDevicePlatform().toUpperCase();
        var payload = {
            notificationProvider: notificationProvider,
            notificationToken: deviceToken,
            mobileClient: {
                platform: platform,
                id: packageName,
                version: appVersion,
            },
        };
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.POST,
            url: this.backend.getPlatformUrl('devices/register'),
            data: JSON.stringify(payload),
            module: types_1.ModuleNames.NOTIFICATIONS,
        })
            .then(invokeServiceSuccess.bind(this))
            .catch(invokeServiceError.bind(this));
        function invokeServiceSuccess(response) {
            this.logger.info('Device registered for push notifications.', response.statusCode);
            return response;
        }
        function invokeServiceError(response) {
            this.logger.error('Device registration for push notifications failed!', response);
            return Promise.reject(response);
        }
    };
    /**
     * Deregisters the current Cordova app running on the device for receiving push notifications.
     * @function
     * @name Notifications#deregisterForNotifications
     * @param deviceToken {String} Platform-specific success callback token.
     * @param packageName {String} Platform-specific application reverse domain identifier.
     * @param notificationProvider {String} The provider to register, posible values: 'APNS', 'FCM', 'WNS', 'SYNIVERSE'.
     * @return {Promise<NetworkResponse>}
     *
     * @example <caption>Example usage of mcs.mobileBackend.notifications.deregisterForNotifications()</caption>
     * mcs.mobileBackend
     *   .notifications
     *    .deregisterForNotifications('YOUR_DEVICE_TOKEN', 'com.yourcompany.project', '1.0.0', 'FCM')
     *    .then(deregisterSuccess)
     *    .catch(deregisterError);
     *
     * function deregisterSuccess(response){
     *   console.log(response);
     * }
     *
     * function deregisterError(response){
     *    console.log(response);
     * }
     * @mcs
     */
    Notifications.prototype.deregisterForNotifications = function (deviceToken, packageName, notificationProvider) {
        if (!(notificationProvider in types_1.NotificationProviders)) {
            throw Error(this._getProviderError(notificationProvider));
        }
        var headers = this.backend.getHttpHeaders();
        headers.add(types_1.Headers.CONTENT_TYPE, types_1.ContentTypes.APPLICATION_JSON);
        var platform = this.platform.getDevicePlatform().toUpperCase();
        var payload = {
            notificationProvider: notificationProvider,
            notificationToken: deviceToken,
            mobileClient: {
                platform: platform,
                id: packageName,
            },
        };
        return this.platform.invokeService({
            headers: headers,
            method: types_1.HttpMethods.POST,
            url: this.backend.getPlatformUrl('devices/deregister'),
            data: JSON.stringify(payload),
            module: types_1.ModuleNames.NOTIFICATIONS,
        })
            .then(invokeServiceSuccess.bind(this))
            .catch(invokeServiceError.bind(this));
        function invokeServiceSuccess(response) {
            this.logger.info('Device deregistered for push notifications succeeded.', response.statusCode);
            return response;
        }
        function invokeServiceError(response) {
            this.logger.error('Device deregistration for push notifications failed!', response);
            return Promise.reject(response);
        }
    };
    Notifications.prototype._getProviderError = function (notificationProvider) {
        return 'No Notification Provider Type called ' + notificationProvider + '\n' +
            'please use one of those types\n' +
            types_1.NotificationProviders.APNS + '\n' +
            types_1.NotificationProviders.FCM + '\n' +
            types_1.NotificationProviders.WNS + '\n' +
            types_1.NotificationProviders.SYNIVERSE;
    };
    return Notifications;
}());
exports.Notifications = Notifications;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var notifications_1 = __webpack_require__(62);
var backend_1 = __webpack_require__(40);
var types_1 = __webpack_require__(0);
var facebook_authorization_1 = __webpack_require__(61);
var external_token_exchange_authorization_1 = __webpack_require__(60);
/**
 * @classdesc Represents a mobile backend in Oracle Mobile Cloud Enterprise
 * and provides access to all capabilities of the backend.
 * Callers should use [mcs's mobileBackend]{@link mcs#mobileBackend} property...
 * @class
 * @hideconstructor
 * @extends Backend
 * @global
 * @mcs
 */
var MobileBackend = /** @class */ (function (_super) {
    __extends(MobileBackend, _super);
    /**
     * Should not be called by the user.
     * @protected
     * @param config
     * @param platform
     * @param utils
     * @param syncExpress
     * @mcs
     */
    function MobileBackend(config, platform, utils, syncExpress) {
        var _this = _super.call(this, config, platform, utils, syncExpress) || this;
        /**
         * Get notifications object.
         * Returns the Notifications object that provides notification capabilities.
         * @readonly
         * @type {Notifications}
         * @name MobileBackend#notifications
         * @mcs
         */
        _this.notifications = null;
        _this.notifications = new notifications_1.Notifications(_this, platform);
        _this._authenticationTypes = _this.platform._getPlatform() === types_1.PlatformNames.REACT_NATIVE
            ? Object.assign({}, types_1.AuthenticationTypes, { facebook: undefined })
            : types_1.AuthenticationTypes;
        return _this;
    }
    /**
     * Set authentication type for mobile backend.
     * Initialize and returns the Authorization object that provides
     * authorization capabilities and access to user properties.
     * @function
     * @name MobileBackend#setAuthenticationType
     * @param {string} type
     * For [Basic authentication]{@link BasicAuthorization}, you would specify "basic"
     * to use the Basic Authentication security schema.<br/>
     * For [OAuth authentication]{@link OAuthAuthorization}, you would specify "oauth"
     * to use OAuth Authentication security schema.<br/>
     * For [External token authentication]{@link ExternalTokenExchangeAuthorization},
     * you would specify "token" to use External Token Authentication security schema.
     * @return {Authorization}
     * @throws When unrecognized authentication type provided,
     * this method will throw an Exception stating that the type of Authentication that you provided
     * is not supported at this time.
     * @example <caption>Example usage of mobileBackend.setAuthenticationType()</caption>
     * // Basic Authorization schema
     * mcs.mobileBackend.setAuthenticationType("basic");
     * @example // OAuth Authorization schema
     * mcs.mobileBackend.setAuthenticationType("oauth");
     * @example // Token Exchange Authorization schema
     * mcs.mobileBackend.setAuthenticationType("token");
     * @mcs:react-native
     */
    /**
     * Set authentication type for mobile backend.
     * Initialize and returns the Authorization object that provides
     * authorization capabilities and access to user properties.
     * @function
     * @name MobileBackend#setAuthenticationType
     * @param {string} type
     * For [Basic authentication]{@link BasicAuthorization}, you would specify "basic"
     * to use the Basic Authentication security schema.<br/>
     * For [OAuth authentication]{@link OAuthAuthorization}, you would specify "oauth"
     * to use OAuth Authentication security schema.<br/>
     * For [External token authentication]{@link ExternalTokenExchangeAuthorization},
     * you would specify "token" to use External Token Authentication security schema.<br/>
     * For [Facebook authentication]{@link FacebookAuthorization}, you would specify "facebook"
     * to use Facebook Authentication security schema.
     * @return {Authorization}
     * @throws When unrecognized authentication type provided,
     * this method will throw an Exception stating that the type of Authentication that you provided
     * is not supported at this time.
     * @example <caption>Example usage of mobileBackend.setAuthenticationType()</caption>
     * // Basic Authorization schema
     * mcs.mobileBackend.setAuthenticationType("basic");
     * @example // OAuth Authorization schema
     * mcs.mobileBackend.setAuthenticationType("oauth");
     * @example // Facebook Authorization schema
     * mcs.mobileBackend.setAuthenticationType("facebook");
     * @example // Token Exchange Authorization schema
     * mcs.mobileBackend.setAuthenticationType("token");
     * @mcs:cordova
     */
    MobileBackend.prototype.setAuthenticationType = function (type) {
        var authType = this.utils.validateConfiguration(type);
        this.authorization = _super.prototype.setAuthenticationType.call(this, authType);
        if (!this.authorization) {
            if (this.authorization && this.authorization._getIsAuthorized()) {
                this.authorization.logout();
            }
            if (authType === types_1.AuthenticationTypes.facebook) {
                var config = this._mbeConfig.authentication.facebook;
                this.authorization = new facebook_authorization_1.FacebookAuthorization(config, this, this.utils, this.platform);
                this._logger.info('Your Authentication type: ' + authType);
                this._authenticationType = authType;
            }
            else if (authType === types_1.AuthenticationTypes.token) {
                var config = this._mbeConfig.authentication.token;
                this.authorization = new external_token_exchange_authorization_1.ExternalTokenExchangeAuthorization(config, this, this.utils, this.platform);
                this._logger.info('Your Authentication type: ' + authType);
                this._authenticationType = authType;
            }
        }
        return this.authorization;
    };
    return MobileBackend;
}(backend_1.Backend));
exports.MobileBackend = MobileBackend;


/***/ }),
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
var browser_platform_1 = __webpack_require__(59);
var logger_1 = __webpack_require__(1);
var types_1 = __webpack_require__(0);
/**
 * Platform class for Cordova applications.
 * Require console, geolocation, PushPlugin, sqlite-storage and device plugins to be installed.
 * @extends BrowserPlatform
 * @private
 */
var CordovaPlatform = /** @class */ (function (_super) {
    __extends(CordovaPlatform, _super);
    function CordovaPlatform(config, utils, navigator, logger) {
        var _this = _super.call(this, config, utils, navigator, logger || new logger_1.Logger('CordovaPlatform')) || this;
        _this.ANDROID_OS_NAME = 'Android';
        _this.IOS_OS_NAME = 'iOS';
        _this._latitude = null;
        _this._longitude = null;
        _this._gpsLocationInitialised = false;
        _this.isBrowser = false;
        _this.isCordova = true;
        return _this;
    }
    CordovaPlatform.prototype.initGPSLocation = function () {
        this._logger.debug('Subscribe to location changes');
        if (!this._gpsLocationInitialised) {
            if (!!this._navigator &&
                !!this._navigator.geolocation &&
                this._navigator.geolocation.watchPosition &&
                this._navigator.geolocation.getCurrentPosition) {
                document.addEventListener('deviceready', deviceReady.bind(this), false);
            }
            else {
                this._logger.warn('This browser does not support geolocation.');
            }
            this._gpsLocationInitialised = true;
        }
        function setPosition(position) {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
        }
        function onError(error) {
            this.logger.error('Error while subscribing for position.', error);
        }
        function deviceReady() {
            this._navigator.geolocation.getCurrentPosition(setPosition, onError);
            this._navigator.geolocation.watchPosition(setPosition, onError);
        }
    };
    /**
     * Overrides [Platform.getGPSLocation()]{@link Platform#getGPSLocation}
     * @override
     */
    CordovaPlatform.prototype.getGPSLocation = function () {
        return {
            latitude: this._latitude,
            longitude: this._longitude,
        };
    };
    /**
     * Checks the current state of the device. Platform implementations should call this function
     * when the state changes. The state is inspected before background operations
     * like synchronization are performed.
     * Cordova Network Information Plugin MUST be installed for this function to operate.
     * `cordova plugin add cordova-plugin-network-information`
     */
    CordovaPlatform.prototype.checkConnection = function () {
        var networkState = this._navigator['connection'].type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        this._logger.info('Connection type: ' + states[networkState]);
        return states[networkState];
    };
    /**
     @return Returns an object of variables used to return device specific information like:
  
     @return model: Nexus One returns "Passion", Motorola Droid  returns "voles", etc.
     *
     @return manufacturer: Returns the manufacturer name:
     *
     * Samsung
     * LG
     * Motorola
     * Micosoft
     * Sony
     * Apple
     *
     @return OS Name: Depending on the device, a few examples are:
     * "Android"
     * "BlackBerry 10"
     * Browser:         returns "MacIntel" on Mac
     *                  returns "Win32" on Windows
     * "iOS"
     * "WinCE"
     * "Tizen"
     *
     @return OS Version: Depending on the device, a few examples are:
     * Android:    Froyo OS would return "2.2"
     Eclair OS would return "2.1", "2.0.1", or "2.0"
     Version can also return update level "2.1-update1"
  
     * BlackBerry: Torch 9800 using OS 6.0 would return "6.0.0.600"
     *
     * Browser:    Returns version number for the browser
  
     * iPhone:     iOS 3.2 returns "3.2"
     * Windows Phone 7: returns current OS version number, ex. on Mango returns 7.10.7720
     * Tizen: returns "TIZEN_20120425_2"
     *
     @return OS Build: Get the version of Cordova running on the device.
     * Overrides [Platform.getDeviceInformation()]{@link Platform#getDeviceInformation}
     * @override
     */
    CordovaPlatform.prototype.getDeviceInformation = function () {
        return {
            model: this._getProperty('model'),
            manufacturer: this._getProperty('manufacturer'),
            osName: this._getProperty('platform'),
            osVersion: this._getProperty('version'),
            osBuild: this._getProperty('cordova'),
            carrier: '<unknown>',
        };
    };
    CordovaPlatform.prototype._getProperty = function (key) {
        var value = typeof device !== 'undefined' ? device[key] : null;
        return value || '<unknown>';
    };
    CordovaPlatform.prototype.getDevicePlatform = function () {
        return device.platform.toUpperCase();
    };
    CordovaPlatform.prototype._getPlatform = function () {
        return types_1.PlatformNames.CORDOVA;
    };
    return CordovaPlatform;
}(browser_platform_1.BrowserPlatform));
exports.CordovaPlatform = CordovaPlatform;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mcs_module_1 = __webpack_require__(43);
var mobile_backend_1 = __webpack_require__(63);
var cordova_platform_1 = __webpack_require__(69);
/**
 * MCS module.
 * @global
 * @namespace mcs
 * @mcs
 */
var MCSCordovaModule = /** @class */ (function (_super) {
    __extends(MCSCordovaModule, _super);
    function MCSCordovaModule(cxa, glob) {
        var _this = _super.call(this, cxa, glob) || this;
        /**
         * Mobile backend object.
         * Represents a mobile backend in Oracle Mobile Cloud Enterprise
         * and provides access to all capabilities of the backend.
         * @name mobileBackend
         * @readonly
         * @type {MobileBackend}
         * @instance
         * @memberOf mcs
         * @mcs
         */
        _this.mobileBackend = null;
        return _this;
    }
    /**
     * Init MCS with configuration
     * @param {OracleMobileCloudConfig} config - MCS configuration
     * The callback will be call when notification received by Cxa Analytics notification provider.
     * @alias init
     * @memberOf mcs
     * @mcs
     */
    MCSCordovaModule.prototype.init = function (config) {
        this._init(config); // ,cxaAnalyticsTrackerParams TODO: uncomment to return cxa
        if (!!config.mobileBackend) {
            this.mobileBackend = new mobile_backend_1.MobileBackend(this._config, this._platform, this._utils, this._syncExpress);
        }
    };
    MCSCordovaModule.prototype._getPlatform = function (config, utils) {
        this._logger.debug('Create Cordova platform');
        return new cordova_platform_1.CordovaPlatform(this._config, this._utils, navigator);
    };
    return MCSCordovaModule;
}(mcs_module_1.MCSModule));
exports.MCSCordovaModule = MCSCordovaModule;
MCSGlobal = MCSCordovaModule;


/***/ })
/******/ ]);

  cxa = function (CXAOAuthAuthorization, NotificationsService, CxaStorage, Logger, mcsPlatform) {

    

  };

  // export mcs library
  var __global;
  if (typeof _window !== 'undefined') {
    __global = _window;
  } else if (typeof _global !== 'undefined') {
    __global = _global;
  } else if (typeof _self !== 'undefined') {
    __global = _self;
  } else {
    __global = _this;
  }

  var mcs = new MCSGlobal(cxa, __global);
  if (typeof _exports === 'object' && typeof _module !== 'undefined') {
    _module.exports = mcs;
  } else if (typeof _define === 'function' && _define.amd) {
    _define([], mcs);
  } else {
    __global.mcs = mcs;
  }

})(typeof module === "undefined" ? undefined : module,
  typeof exports === "undefined" ? undefined : exports,
  typeof define === "undefined" ? undefined : define,
  typeof window === "undefined" ? undefined : window,
  typeof global === "undefined" ? undefined : global,
  typeof self === "undefined" ? undefined : self,
  this);
