/**
 * Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 * Oracle Mobile Cloud Enterprise Sync JavaScript SDK, Release: 18.3.3.0
 */

(function(_module, _exports, _define, _window, _global, _self, _this) {
  var MCSSyncModuleGlobal;

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
/******/ 	return __webpack_require__(__webpack_require__.s = 58);
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
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
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
/* 7 */,
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
/* 10 */,
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
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 20 */
/***/ (function(module, exports) {
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*
* @authors Lyudmil Pelov, Yuri Panshin
*
* Utility class for the persistence library
*/
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var SyncUtils = /** @class */ (function () {
    function SyncUtils($common, $options) {
        this.$common = $common;
        this.$options = $options;
        /**
         * Cache in-memory all already parsed URLs!
         * @type {{}}
         */
        this.isPersistUrlCache = {};
        /**
         * Cache the parsed values for given URLs!
         *
         * @type {{}}
         */
        this.keyValuesFromPersistentUrlCache = {};
        this.methods = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch'];
        this.logger = new logger_1.Logger('Utils');
    }
    /**
     * This simple implementation will check if specific path match and URL for persistence and return
     * object with all parameters.
     *
     * @param options
     * @returns {Function}
     * @throws Error - in case decoding of given parameter is not possible
     */
    SyncUtils.prototype.pathMatch = function (options) {
        options = options || {};
        var self = this;
        return function (path) {
            var keys = [];
            var re = pathToRegexp(path, keys, options);
            return function (pathname, params) {
                var m = re.exec(pathname);
                if (!m)
                    return false;
                params = params || [];
                var key, param, obj = {};
                for (var i = 0; i < keys.length; i++) {
                    key = keys[i];
                    param = m[i + 1];
                    if (!param)
                        continue;
                    obj = {
                        name: key.name,
                        value: self.decodeParam(param),
                    };
                    params.push(obj);
                    if (key.repeat) {
                        params[params.length - 1].name = params[params.length - 1].name.split(key.delimiter);
                    }
                }
                return params;
            };
        };
    };
    SyncUtils.prototype.getXHRResponse = function (xhr) {
        var response = xhr.responseType === '' || xhr.responseType === 'text' ? xhr.responseText : xhr.response;
        if (typeof response === 'string') {
            return response.length > 0 ? JSON.parse(response) : null;
        }
        else {
            return response;
        }
    };
    /**
     * Decodes parameters from the url
     *
     * @param param
     * @returns {string}
     */
    SyncUtils.prototype.decodeParam = function (param) {
        try {
            return decodeURIComponent(param);
        }
        catch (e) {
            throw Error('failed to decode param "' + param + '"');
        }
    };
    /**
     * isPathConfiguredForPersistence method result
     * @callback Persistence.Sync~isPersistUrl
     * @param url {String}.
     * @param match {Array} parsed matches.
     */
    /**
     * Checks based on the pre-prefigured regexp in Persistence.Options if URL was configured for persistence.
     *
     * @param path {String} Url to check
     * @returns {Persistence.Sync~isPersistUrl} - parsed url regexp and parsed matches
     */
    SyncUtils.prototype.isPersistUrl = function (path) {
        if (path == null || typeof path !== 'string') {
            this.logger.warn('isPersistentUrl -> path can be only string');
            return false;
        }
        if (path in this.isPersistUrlCache) {
            return this.isPersistUrlCache[path];
        }
        var len = this.$options.persistUris.length;
        for (var i = 0; i < len; i++) {
            var match = this.$options.persistUris[i].reg.exec(path);
            if (match) {
                return this.isPersistUrlCache[path] = {
                    match: match,
                    uri: this.$options.persistUris[i],
                };
            }
        }
        return this.isPersistUrlCache[path] = false;
    };
    SyncUtils.prototype.isUrlRegexInteger = function (str) {
        return (str.indexOf('\d') >= 0);
    };
    SyncUtils.prototype.nestedUrlPropertyToValue = function (prop) {
        if (!prop && !prop.value)
            return '';
        return prop.isInteger ? parseInt(prop.value, 10) : prop.value;
    };
    /**
     * Parse the URL parameters and store in the cache!
     * @param persistURL
     * @returns {*}
     */
    SyncUtils.prototype.extractKeyValuesFromUrl2 = function (persistURL) {
        if (persistURL.match[0] in this.keyValuesFromPersistentUrlCache) {
            return this.keyValuesFromPersistentUrlCache[persistURL.match[0]];
        }
        var query = {
            root: persistURL.uri.tokens[0],
            attr: [],
        };
        var keys = persistURL.uri.tokens;
        var parsedKeys = 1; // first token is always the root path! go directly to the next one
        for (var pos = 1; pos < keys.length; pos++) {
            if (this.$common.isObject(persistURL.uri.tokens[pos])) {
                var matchId = parsedKeys++;
                var interName = persistURL.uri.tokens[pos];
                if (persistURL.match[matchId]) {
                    query.attr.push({
                        name: this.$common.stringStartsWith(interName.name, '/')
                            || this.$common.stringStartsWith(interName.name, '_')
                            ? interName.name.substring(1)
                            : interName.name,
                        value: persistURL.match[matchId],
                        pattern: interName.pattern,
                        is: !!(this.$common.stringStartsWith(interName.name, '/')
                            || this.$common.stringStartsWith(interName.name, '_')),
                        isInteger: this.isUrlRegexInteger(interName.pattern),
                    });
                }
            }
            else {
                var interName = persistURL.uri.tokens[pos];
                if (interName) {
                    query.attr.push({
                        name: interName,
                        value: this.$common.stringStartsWith(interName, '/')
                            || this.$common.stringStartsWith(interName, '_')
                            ? interName.substring(1) : interName,
                        is: false,
                        isInteger: this.isUrlRegexInteger(interName),
                    });
                }
            }
        }
        return this.keyValuesFromPersistentUrlCache[persistURL.match[0]] = query;
    };
    /**
     * Use this to transform payload before send to the server, in case that the payload is not JSON!
     *
     * @param payload
     * @returns {string}
     */
    SyncUtils.prototype.transformQueryParams = function (payload) {
        var array = [];
        for (var key in payload) {
            array.push(encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]));
        }
        return array.join('&');
    };
    /**
     * Set the value to the object depending on the type of the existing object and the given new value!
     *
     * @param obj - existing object, usually from the db
     * @param val - new payload data to set to the existing object!
     */
    SyncUtils.prototype.setValueToObject = function (obj, val) {
        if (this.$common.isFunction(val)) {
            throw new Error('unknown payload object, cannot assign function to payload!');
        }
        if (Array.isArray(obj) && Array.isArray(val)) {
            obj = val;
        }
        else if (Array.isArray(obj) && (!Array.isArray(val) && this.$common.isObject(val))) {
            obj.push(val);
        }
        else {
            obj = val;
        }
        return obj;
    };
    /**
     * Set new attribute to the existing object or update if exist.
     * Examples:
     *  setData("key1", "updated value1"); // data.key1 == "updated value1"
     *  setData("key2.nested1", 99); // data.key2.nested1 == 99
     *
     * @param key
     * @param val
     * @param obj
     * @private
     */
    SyncUtils.prototype.setData = function (key, val, obj) {
        if (!obj)
            obj = {}; // outside (non-recursive) call, use "data" as our base object
        var ka = key.split(/\./); // split the key by the dots
        if (ka.length < 2) {
            obj[ka[0]] = val; // only one part (no dots) in key, just set value
        }
        else {
            if (!obj[ka[0]])
                obj[ka[0]] = {};
            obj = obj[ka.shift()];
            this.setData(ka.join('.'), val, obj);
        }
    };
    /**
     *
     * @param key
     * @param val
     * @param obj
     * @private
     */
    SyncUtils.prototype._setData2 = function (key, val, obj) {
        if (!obj)
            obj = {}; // outside (non-recursive) call, use "data" as our base object
        var ka = key.split(/\./); // split the key by the dots
        if (ka.length < 2) {
            if (!obj[ka[0]]) {
                obj[ka[0]] = val;
            }
            else {
                if (Array.isArray(obj[ka[0]]) && Array.isArray(val)) {
                    obj[ka[0]] = val;
                }
                else if (Array.isArray(obj[ka[0]]) && (!Array.isArray(val) && this.$common.isObject(val))) {
                    obj[ka[0]].push(val);
                }
                else {
                    obj[ka[0]] = val;
                }
            }
        }
        else {
            if (!obj[ka[0]])
                obj[ka[0]] = {}; // create our "new" base obj if it doesn't exist
            obj = obj[ka.shift()];
            this.setData(ka.join('.'), val, obj);
        }
    };
    /**
     * Get value from nested JSON object payload
     * @param key
     * @param obj
     * @returns {*}
     * @private
     */
    SyncUtils.prototype._getData = function (key, obj) {
        if (!obj)
            return {}; // outside (non-recursive) call, use "data" as our base object
        var ka = key.split(/\./); // split the key by the dots
        if (ka.length < 2) {
            return obj[ka[0]]; // only one part (no dots) in key, just set value
        }
        else {
            if (!obj[ka[0]])
                return {}; // create our "new" base obj if it doesn't exist
            obj = obj[ka.shift()];
            this._getData(ka.join('.'), obj);
        }
    };
    SyncUtils.prototype.isOfflinePersistObj = function (obj) {
        if ('meta' in obj && obj.meta.hasOwnProperty('offline-persist')) {
            return true;
        }
        return false;
    };
    /**
     * Property structure
     * @typedef persistenceUtils~Property
     * @property name {String} name of property
     * @property value {String} value of property
     * @property isProperty {Boolean} show if this is a property (:_property) or an id (:id(\\d+))
     * @property isInteger {Boolean} show if property value is integer
     */
    /**
     * Check if given object has specific (nested)property and set the given value to that payload. In case that the value
     * of the nested property is Array, will try to find for given key:value and replace it, if not exist, add to it.
     * @deprecated
     * @param object - usually a object from the DB
     * @param property {persistenceUtils~Property} property structure to search into
     * @param value - payload usually from the REST call
     * @returns {*} - the final object
     */
    SyncUtils.prototype.setNestedProperty = function (object, property, value) {
        var _this = this;
        if (object && typeof object == 'object') {
            if (typeof property == 'string' && property !== '') {
                var split_1 = property.split('.');
                return split_1.reduce(function (obj, prop, idx) {
                    var keyValue = {
                        name: null,
                        value: null,
                    };
                    var propMatch = prop.match(/\[(.*?)\]/);
                    if (!propMatch) {
                        obj[prop] = obj[prop] || {};
                    }
                    else {
                        keyValue.name = prop.substr(0, prop.indexOf('['));
                        keyValue.value = propMatch[1];
                    }
                    if (split_1.length == (idx + 1)) {
                        if (propMatch) {
                            if (Array.isArray(obj)) {
                                var index = obj.findIndex(function (item) { return item[keyValue.name] == keyValue.value; });
                                return (index > -1) ? _this.$common.deepExtend(value, obj[index]) : obj.push(value);
                            }
                            else {
                                if (obj[keyValue.name] == keyValue.value) {
                                    return _this.$common.deepExtend(value, obj[keyValue.name]);
                                }
                                else {
                                    obj[keyValue.name] = keyValue.value;
                                    return _this.$common.deepExtend(value, obj);
                                }
                            }
                        }
                        else {
                            return obj[prop] = value;
                        }
                    }
                    if (propMatch) {
                        if (Array.isArray(obj)) {
                            var index = obj.findIndex(function (item) {
                                return item[keyValue.name] === keyValue.value;
                            });
                            return (index > -1) ? obj[index] : {};
                        }
                        else {
                            if (obj[keyValue.name] == keyValue.value) {
                                return obj[keyValue.name];
                            }
                            else {
                                return obj[keyValue.name] = keyValue.value;
                            }
                        }
                    }
                    else {
                        return obj[prop];
                    }
                }, object);
            }
            else {
                return object;
            }
        }
        else {
            return object;
        }
    };
    /**
     * This should be the new way to go, using object directly, provides more stable logic!
     *
     * @param object
     * @param property {Array<persistenceRequestHandler~Property>} - property structure to search into:
     *                {
     *                   name: String,
     *                   value: String,
     *                   isProperty: true/false,
     *                   isInteger: true/false
     *                 }
     * @param value
     * @param nestedQuery {Object} - query to find exists nested item in collection
     * @returns {*}
     */
    SyncUtils.prototype.setNestedProperty2 = function (object, property, value, nestedQuery) {
        var _this = this;
        if (!object || typeof object !== 'object')
            return object;
        if (!this.$common.isArray(property) || !(property.length > 0))
            return object;
        return property.reduce(function (obj, prop, idx) {
            if (prop.isProperty) {
                obj[prop.name] = obj[prop.name] || [];
            }
            if (property.length === (idx + 1)) {
                if (!prop.isProperty) {
                    if (Array.isArray(obj)) {
                        var index = obj.findIndex(function (item) { return item[prop.name] == _this.nestedUrlPropertyToValue(prop); });
                        if (index > -1) {
                            _this.$common.deepExtend(obj[index], value);
                        }
                        else {
                            value[prop.name] = _this.nestedUrlPropertyToValue(prop);
                            obj.push(value);
                        }
                        return value;
                    }
                    else {
                        if (obj[prop.name] == _this.nestedUrlPropertyToValue(prop)) {
                            _this.$common.deepExtend(obj, value);
                            return value;
                        }
                        else {
                            obj[prop.name] = _this.nestedUrlPropertyToValue(prop);
                            _this.$common.deepExtend(obj, value);
                            return value;
                        }
                    }
                }
                else if (Array.isArray(value)) {
                    obj[prop.name] = value;
                    return value;
                }
                else {
                    if (nestedQuery) {
                        var nestedItems = obj[prop.name];
                        for (var _i = 0, _a = Object.keys(nestedItems); _i < _a.length; _i++) {
                            var key = _a[_i];
                            if (nestedItems[key][nestedQuery.key.name] === nestedQuery.value) {
                                _this.$common.deepExtend(nestedItems[idx], value);
                                break;
                            }
                        }
                    }
                    else {
                        obj[prop.name].push(value);
                    }
                    return value;
                }
            } // END
            if (!prop.isProperty) {
                if (Array.isArray(obj)) {
                    var self_1 = _this;
                    var index = obj.findIndex(function (item) { return item[prop.name] === self_1.nestedUrlPropertyToValue(prop); });
                    return (index > -1) ? obj[index] : {};
                }
                else {
                    if (obj[prop.name] == _this.nestedUrlPropertyToValue(prop)) {
                        return obj;
                    }
                    else {
                        return obj[prop.name] = _this.nestedUrlPropertyToValue(prop);
                    }
                }
            }
            else {
                return obj[prop.name];
            }
        }, object);
    };
    /**
     * Search for (nested)property in the given object!
     *
     * @param object - usually from the offline db
     * @param property - property to search for in the form: prop1.prop2[value1].prop3....
     * @returns {*}
     */
    SyncUtils.prototype.getNestedProperty = function (object, property) {
        var _this = this;
        if (!object || typeof object !== 'object')
            return object;
        if (!this.$common.isArray(property) || property.length === 0)
            return object;
        return property.reduce(function (obj, prop) {
            if (prop.isProperty) {
                return obj && obj[prop.name];
            }
            else {
                var keyValue_1 = {
                    name: prop.name,
                    value: _this.nestedUrlPropertyToValue(prop),
                };
                if (Array.isArray(obj) && !prop.isProperty) {
                    var index = obj.findIndex(function (item) { return item[keyValue_1.name] == keyValue_1.value; });
                    return (index > -1) ? obj[index] : (obj[keyValue_1.name] && obj);
                }
                else if (!prop.isProperty) {
                    return (obj[keyValue_1.name] == keyValue_1.value) ? obj : (obj[keyValue_1.name] && obj);
                }
                else {
                    return obj && obj[keyValue_1.name];
                }
            }
        }, object);
    };
    /**
     * Match url with wild cards!
     *
     * Example:
     *    var matchUrl = 'http://localhost:3000/internals/todo1';
     *    var excludeUri = ['http://localhost:3000/internals/*', 'http://localhost:3000/internals/todo3'];
     *
     *   for (var url in excludeUri) {
   *      console.log(matchUri(matchUrl, excludeUri[url]));
   *   }
     *
     * @param str
     * @param rule
     * @returns {boolean}
     */
    SyncUtils.prototype.matchUri = function (str, rule) {
        return new RegExp('^' + rule.replace('*', '.*') + '$').test(str);
    };
    /**
     * Parse XHR returned headers.
     *
     * Link: https://jsperf.com/parse-response-headers-from-xhr
     *
     * @param headerStr
     * @returns {{}}
     * @private
     */
    SyncUtils.prototype.parseResponseHeaders = function (headerStr) {
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
    /**
     * Check if given link is configured for persistent. The host in the URL does not play a role, you can pass values
     * like http://server:port/path1/path2 or just /path1/path2
     *
     * @param url
     * @returns {{uri, match}}
     */
    SyncUtils.prototype.isPersistentURL = function (url) {
        var parsed = this.$options.parseURL(url);
        return this.isPersistUrl(parsed.path);
    };
    SyncUtils.prototype._isURLConfiguredForPersistence = function (path, returnUrl) {
        var url = this.isPersistentURL(path);
        if (this.$common.isEmpty(url) || url === false) {
            throw new Error('give url was configured for persistence:' + path);
        }
        if (!returnUrl) {
            return this.extractKeyValuesFromUrl2(url);
        }
        return url;
    };
    /**
     * Makes sure that it cleans the sync log object form the database form DB specific arguments.
     *
     * @param obj - object should be passed by value!
     * @param cloneObject - boolean value to notify if object should be clone!
     */
    SyncUtils.prototype.cleanSyncLogObjectFromDBSpecificProperties = function (obj, cloneObject) {
        var _obj = cloneObject ? JSON.parse(JSON.stringify(obj)) : obj;
        if (_obj.hasOwnProperty('$loki') && typeof (_obj.$loki) === 'number' && !isNaN(_obj.$loki)) {
            delete _obj.$loki;
        }
        if (_obj.hasOwnProperty('meta')) {
            delete _obj.meta;
        }
        return _obj;
    };
    /**
     * Checks if the application runs in a web view!
     * @returns {boolean} Check if we are running within a WebView (such as Cordova).
     */
    SyncUtils.prototype._isWebView = function () {
        return !(!window['cordova'] && !window['PhoneGap'] && !window['phonegap'] && !window['forge']);
    };
    SyncUtils.prototype._isMcsSyncResourceType = function (xhr) {
        return true; // TODO: check this return
    };
    /**
     * Checks if given object has the parsing method implemented for the HTTP method
     * @param obj
     * @param method
     * @returns {boolean}
     * @private
     */
    SyncUtils.prototype.isSupportedHTTPMethod = function (obj, method) {
        return typeof obj[this._normalizeMethod(method)] === 'function';
    };
    SyncUtils.prototype._normalizeMethod = function (method) {
        var upcased = method.toLowerCase();
        return (this.methods.indexOf(upcased) > -1) ? upcased : method;
    };
    SyncUtils.prototype._isLokiDbObj = function (obj) {
        if ('$loki' in obj && typeof (obj.$loki) === 'number' && !isNaN(obj.$loki)) {
            return true;
        }
        return false;
    };
    return SyncUtils;
}());
exports.SyncUtils = SyncUtils;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*
* @authors Yuri Panshin
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
 * This module provide the Oracle REST Persistent capabilities
 * @ignore
 * @type {{}}
 */
var OracleRestRequestHandler = /** @class */ (function (_super) {
    __extends(OracleRestRequestHandler, _super);
    function OracleRestRequestHandler(options, common, utils, lokiStorageAdapter) {
        return _super.call(this, 'oracle-rest-request', options, common, utils, lokiStorageAdapter) || this;
    }
    OracleRestRequestHandler.prototype.getResponsePayload = function (response) {
        return response.data.items || response.data;
    };
    OracleRestRequestHandler.prototype.getModuleName = function () {
        return 'OracleRest';
    };
    OracleRestRequestHandler.prototype.buildResponseObject = function (obj) {
        if (this.$common.isArray(obj)) {
            return {
                items: obj,
            };
        }
        else {
            return obj;
        }
    };
    OracleRestRequestHandler.prototype.isPersistentGetRequest = function (request) {
        _super.prototype.isPersistentGetRequest.call(this, request);
        if (request.data) {
            if (this.$common.isEmpty(request.data)) {
                throw new Error('cannot proceed with empty payload');
            }
        }
        return true;
    };
    return OracleRestRequestHandler;
}(request_handler_1.RequestHandler));
exports.OracleRestRequestHandler = OracleRestRequestHandler;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(20);
var bytesToUuid = __webpack_require__(19);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(20);
var bytesToUuid = __webpack_require__(19);

var _nodeId;
var _clockseq;
var _lastMSecs = 0;
var _lastNSecs = 0;
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;
  msecs += 12219292800000;
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;
  b[i++] = clockseq >>> 8 | 0x80;
  b[i++] = clockseq & 0xff;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(47);
var v4 = __webpack_require__(46);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var uuid = __webpack_require__(48);
var SyncXMLHttpRequest = /** @class */ (function () {
    function SyncXMLHttpRequest(OriginalXMLHttpRequest, $options, $handler, $sync, $common, $utils, $events) {
        var _this = this;
        this.$options = $options;
        this.$handler = $handler;
        this.$sync = $sync;
        this.$common = $common;
        this.$utils = $utils;
        this.$events = $events;
        this._req = {
            url: '',
            headers: {
                'Content-Type': SyncXMLHttpRequest.defaultContentTypeHeader,
            },
            data: undefined,
            method: '',
            username: '',
            password: '',
            responseType: undefined,
            SYNCID: undefined,
        };
        this.logger = new logger_1.Logger('SyncXMLHttpRequest');
        this.logger.debug('sync express', 'create SyncXMLHttpRequest');
        this.originalXHR = new OriginalXMLHttpRequest();
        this.isDbFirst = $options.isDbFirst();
        var PROPERTIES = SyncXMLHttpRequest.PROPERTIES;
        [PROPERTIES.UPLOAD].forEach(function (item) {
            Object.defineProperty(_this, item, {
                get: function () { return _this.xhr[item]; },
            });
        });
        [PROPERTIES.ABORT].forEach(function (item) {
            Object.defineProperty(_this, item, {
                value: function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    return _this.xhr[item].apply(_this.xhr, params);
                },
            });
        });
        [
            PROPERTIES.ON_TIMEOUT,
            PROPERTIES.TIMEOUT,
            PROPERTIES.WITH_CREDENTIALS,
            PROPERTIES.ON_PROGRESS,
            PROPERTIES.ON_ABORT,
            PROPERTIES.ON_LOAD_START,
            PROPERTIES.ON_LOAD_END,
            PROPERTIES.DONE,
            PROPERTIES.UNSENT,
            PROPERTIES.HEADERS_RECEIVED,
            PROPERTIES.LOADING,
            PROPERTIES.OPENED,
        ].forEach(function (item) {
            Object.defineProperty(_this, item, {
                get: function () { return _this.xhr[item]; },
                set: function (obj) { return _this.xhr[item] = obj; },
            });
        });
    }
    Object.defineProperty(SyncXMLHttpRequest.prototype, "xhr", {
        get: function () {
            return this.originalXHR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncXMLHttpRequest.prototype, "onerror", {
        get: function () {
            return this.xhr.onerror;
        },
        set: function (onError) {
            var _this = this;
            if (this.persistentPath !== false) {
                this.originalOnError = onError;
                this.xhr.onerror = function () {
                    _this.syncOnError();
                    onError.call(_this);
                };
            }
            else {
                this.xhr.onerror = onError;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncXMLHttpRequest.prototype, "onload", {
        get: function () {
            return this.xhr.onload;
        },
        set: function (onLoad) {
            var _this = this;
            if (this.persistentPath !== false) {
                this.originalOnLoad = onLoad;
                this.xhr.onload = function () {
                    _this.onreadystatechangefunction();
                    onLoad.call(_this);
                };
            }
            else {
                this.xhr.onload = onLoad;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncXMLHttpRequest.prototype, "onreadystatechange", {
        get: function () {
            return this.xhr.onreadystatechange;
        },
        set: function (onReadyStateChange) {
            var _this = this;
            if (this.persistentPath !== false) {
                this.originalOnReadyState = onReadyStateChange;
                this.xhr.onreadystatechange = function () {
                    if (_this.xhr.readyState === 4) {
                        _this.onreadystatechangefunction();
                    }
                    else {
                        _this.readyState = _this.xhr.readyState;
                        _this.response = _this.xhr.response;
                        if (_this.xhr.responseType === '' || _this.xhr.responseType === 'text') {
                            _this.responseText = _this.xhr.responseText;
                        }
                        _this.responseXML = _this.xhr.responseXML;
                        _this.status = _this.xhr.status;
                        _this.statusText = _this.xhr.statusText;
                        _this.responseType = _this.xhr.responseType;
                    }
                    onReadyStateChange.call(_this);
                };
            }
            else {
                this.xhr.onreadystatechange = function () {
                    onReadyStateChange.call(_this.xhr);
                };
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Some developers prefer to use the event listener!
     *
     * @param event
     * @param callback
     * @returns {*}
     */
    SyncXMLHttpRequest.prototype.addEventListener = function (event, callback) {
        if (this.persistentPath !== false) {
            if (event === 'load') {
                this.onload = callback;
            }
            else if (event === 'error') {
                this.onerror = callback;
            }
            else {
                this.xhr.addEventListener(event, callback);
            }
        }
        else {
            this.xhr.addEventListener.apply(this.xhr, arguments);
        }
    };
    SyncXMLHttpRequest.prototype.overrideMimeType = function (mimeType) {
        if (this.persistentPath !== false) {
            if (!this._req.headers) {
                this._req.headers = {};
            }
            if (typeof mimeType === 'string') {
                this.forceMimeType = mimeType.toLowerCase();
                this._req.headers['Content-Type'] = this.forceMimeType;
            }
            this.xhr.overrideMimeType(mimeType);
        }
        else {
            this.xhr.overrideMimeType.apply(this.xhr, arguments);
        }
    };
    /**
     * Get the headers to properly intercept!
     * NOTICE: There is no need to check for unsafe headers, as the original XHR object will throw exceptions
     * if this is the case
     *
     * @param header
     * @param value
     * @returns {*}
     */
    SyncXMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        if (this.persistentPath !== false) {
            if (SyncXMLHttpRequest.UNSAFE_HEADERS[header] || /^(Sec-|Proxy-)/.test(header)) {
                throw new Error('Refused to set unsafe header "' + header + '"');
            }
            this.xhr.setRequestHeader(header, value);
            if (!this._req.headers) {
                this._req.headers = {};
            }
            this._req.headers[header] = value;
        }
        else {
            this.xhr.setRequestHeader.apply(this.xhr, arguments);
        }
    };
    SyncXMLHttpRequest.prototype._setResponseHeaders = function (headers) {
        this.responseHeaders = {};
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.responseHeaders[header] = headers[header];
            }
        }
        if (this.forceMimeType) {
            this.responseHeaders['Content-Type'] = this.forceMimeType;
        }
        this.readyState = this[SyncXMLHttpRequest.PROPERTIES.HEADERS_RECEIVED];
    };
    SyncXMLHttpRequest.prototype.uniqueID = function () {
        if (!this.uniqueIDMemo) {
            if (uuid) {
                this.uniqueIDMemo = uuid.v4();
            }
            else {
                this.uniqueIDMemo = this.$common.getUID();
            }
        }
        return this.uniqueIDMemo;
    };
    SyncXMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this.persistentPath = this.$options.isPersistentUrl(url);
        this.logger.debug('open:', url, this.persistentPath);
        if (this.persistentPath === false) {
            this.logger.debug('open', 'defake and continue with the original object, non of the proxy methods will be used!');
            this.defake();
            return this.xhr.open(method, url, true, user, password); // send it on
        }
        else {
            this.logger.debug('open', 'PROXY use the proxy');
            this._req.method = method;
            this._req.url = url;
            this._req.username = user;
            this._req.password = password;
            return this.xhr.open.apply(this.xhr, arguments);
        }
    };
    SyncXMLHttpRequest.prototype.getAllResponseHeaders = function () {
        if (this.readyState < this[SyncXMLHttpRequest.PROPERTIES.HEADERS_RECEIVED]) {
            return '';
        }
        var headers = '';
        for (var _i = 0, _a = this.responseHeaders; _i < _a.length; _i++) {
            var header = _a[_i];
            if (!/^Set-Cookie2?$/i.test(header)) {
                headers += header + ': ' + this.responseHeaders[header] + '\r\n';
            }
        }
        return headers;
    };
    SyncXMLHttpRequest.prototype.getResponseHeader = function (header) {
        if (this.readyState < this[SyncXMLHttpRequest.PROPERTIES.HEADERS_RECEIVED]) {
            return null;
        }
        if (/^Set-Cookie2?$/i.test(header)) {
            return null;
        }
        header = header.toLowerCase();
        for (var _i = 0, _a = this.responseHeaders; _i < _a.length; _i++) {
            var h = _a[_i];
            if (h.toLowerCase() == header) {
                return this.responseHeaders[h];
            }
        }
        return null;
    };
    /**
     * This interceptor will decide which way we want to go depending on user configurations!
     * @param postBody
     */
    SyncXMLHttpRequest.prototype.send = function (postBody) {
        var _this = this;
        this.logger.info('SyncXMLHttpRequest.send', postBody);
        if (this[SyncXMLHttpRequest.PROPERTIES.RESPONSE_TYPE]) {
            this._req.responseType = this[SyncXMLHttpRequest.PROPERTIES.RESPONSE_TYPE];
        }
        try {
            if (postBody) {
                if (typeof postBody === 'string') {
                    this._req.data = JSON.parse(postBody);
                }
                else {
                    this._req.data = JSON.parse(JSON.stringify(postBody));
                }
            }
        }
        catch (e) {
            throw new Error('persistence library could execute only JSON payload!');
        }
        var isOnline = this.$options.isOnline();
        var whenOffline = function () {
            setTimeout(function () {
                _this.logger.debug('Sync XHR in OFF-LINE MODE');
                handleOfflineRequest(_this._req, true);
            }, 1);
        };
        var isPolicy = function (policy, value) { return _this.persistentPath.isPolicy(policy, value); };
        var whenOnline = function () {
            setTimeout(function () {
                _this.logger.debug('Sync XHR in ON-LINE MODE');
                if (isPolicy('fetchPolicy', 'FETCH_FROM_CACHE_SCHEDULE_REFRESH') || _this.isDbFirst) {
                    handleOfflineRequest(_this._req, false);
                }
                isObjectNeverSynced.bind(_this)() && exeXHR.bind(_this)();
            }, 1);
        };
        !isOnline ? whenOffline() : whenOnline();
        var defaultContentHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            'Request-ID': this.uniqueID(),
        };
        var $respond = function (status, headers, body) {
            if (isPolicy('fetchPolicy', 'FETCH_FROM_CACHE_SCHEDULE_REFRESH') || _this.isDbFirst) {
                _this.$handler.dispatchEvent(status, SyncXMLHttpRequest.HTTP_STATUS_CODES[status], body, _this.uniqueID());
            }
            else {
                _this.respond2(status, headers, body);
            }
        };
        var handleOfflineRequest = function (req, toSync) {
            var parsingModule = _this.$options.module;
            if (req.method === 'GET') {
                delete req.data;
            }
            if (isPolicy('noCache', false) && _this.$utils.isSupportedHTTPMethod(parsingModule, req.method)) {
                return parsingModule.router(req)
                    .then(function (response) {
                    if (req.hasOwnProperty('method')) {
                        if (req.method !== 'GET') {
                            if (toSync === true) {
                                _this._req.data = response;
                                _this.$sync.router(_this._req);
                            }
                        }
                    }
                    return response;
                })
                    .then(function (response) {
                    if (!_this.$common.isEmpty(response)) {
                        _this.respond2(200, defaultContentHeaders, response);
                    }
                    else {
                        _this.respond2(404, defaultContentHeaders, 'Offline Not Found');
                    }
                })
                    .catch(function (err) {
                    _this.logger.error(err);
                    _this.respond2(400, defaultContentHeaders, err);
                });
            }
            else {
                if (req.hasOwnProperty('method') && _this.$utils.isSupportedHTTPMethod(_this.$sync, req.method)) {
                    if (req.method !== 'GET') {
                        if (toSync === true) {
                            _this._req.data = req.data;
                            _this.$sync.router(req).then(function (result) {
                                _this.respond2(200, defaultContentHeaders, null);
                            }).catch(function (error) { return _this.respond2(400, defaultContentHeaders, null); });
                        }
                        else {
                            _this.respond2(0, defaultContentHeaders, null);
                        }
                    }
                    else {
                        _this.respond2(0, defaultContentHeaders, null);
                    }
                }
                else {
                    _this.respond2(400, defaultContentHeaders, null);
                }
            }
        };
        function isObjectNeverSynced() {
            if (!this.$common.isEmpty(postBody) && this.$common.isObject(postBody)) {
                if (postBody.hasOwnProperty('meta') && postBody.meta.hasOwnProperty('offline-persist')) {
                    if (this._req.method === 'GET') {
                        return false;
                    }
                }
                else {
                    if (postBody.hasOwnProperty('$loki')) {
                        delete postBody['$loki'];
                    }
                    if (postBody.hasOwnProperty('meta')) {
                        delete postBody['meta'];
                    }
                }
            }
            return true;
        }
        function exeXHR() {
            var _this = this;
            var syncRequestID = this.uniqueID() + '-SYNC-' + Math.floor(Math.random() * 1000);
            this._req.SYNCID = syncRequestID;
            this.$sync.router(this._req)
                .then(function () {
                _this.$handler.addListener(syncRequestID, function (e) {
                    reqListener.bind(_this)(e.detail.data);
                }, false);
                _this.$sync.operations.runSync(true);
            })
                .catch(function (error) {
                _this.logger.error(error);
                $respond(400, defaultContentHeaders, error);
            });
        }
        /**
         * @deprecated - this should be moved the sync library!
         * @param xhr
         */
        function reqListener(xhr) {
            var _this = this;
            var parsingModule = this.$options.module;
            var xhrResponse = this.$utils.getXHRResponse(xhr);
            if (xhr.readyState === 4) {
                if (this.$common.isEmpty(xhrResponse)) {
                    xhrResponse = '';
                }
                var responseHeaders_1 = this.$utils.parseResponseHeaders(xhr.getAllResponseHeaders());
                responseHeaders_1['Request-ID'] = this.uniqueID();
                if (xhr.status >= 200 && xhr.status < 300) {
                    this.$events.$emit('success', {
                        data: xhrResponse,
                        status: xhr.status,
                        headers: xhr.getAllResponseHeaders(),
                        requestID: this.uniqueID(),
                    });
                    var contentTypeResponseHeader = xhr.getResponseHeader('Content-Type');
                    if (contentTypeResponseHeader === null) {
                        if (this._req.method !== 'DELETE') {
                            throw new Error('XHR did not return any HTTP headers!');
                        }
                    }
                    else {
                        contentTypeResponseHeader = contentTypeResponseHeader && contentTypeResponseHeader.split(';', 1)[0];
                        if ((contentTypeResponseHeader == null) || (contentTypeResponseHeader !== 'application/json')) {
                            if (this._req.method !== 'DELETE') {
                                throw new Error('persistence library could handle only JSON responses!');
                            }
                        }
                        else if (typeof xhrResponse === 'string' && xhrResponse.length > 0) {
                            xhrResponse = JSON.parse(xhrResponse);
                        }
                    }
                    this._req.headers = responseHeaders_1;
                    if (isPolicy('noCache', false) && this.$utils.isSupportedHTTPMethod(parsingModule, this._req.method)) {
                        this._req.data = xhrResponse;
                        if (this._req.method === 'POST' || this._req.method === 'PUT' || this._req.method === 'PATCH') {
                            if (this._req.data.meta !== undefined && this._req.data.meta.hasOwnProperty('offline-persist')) {
                                delete this._req.data.meta['offline-persist'];
                            }
                        }
                        parsingModule.router(this._req)
                            .then(function () { return $respond(xhr.status, responseHeaders_1, xhrResponse); })
                            .catch(function (err) {
                            _this.logger.error(err);
                            $respond(400, responseHeaders_1, err);
                        });
                    }
                    else {
                        $respond(xhr.status, responseHeaders_1, xhrResponse);
                    }
                }
                else {
                    if ((xhr.status >= 300 && xhr.status != 304)) {
                        this.$events.$emit('error', {
                            event: xhr,
                        });
                        this._req.headers = responseHeaders_1;
                        if (isPolicy('noCache', false) && this.$utils.isSupportedHTTPMethod(parsingModule, this._req.method)) {
                            if (this._req.method === 'GET') {
                                this._req.data = [];
                            }
                            parsingModule.router(this._req).then(function (result) {
                                !result ? $respond(xhr.status, responseHeaders_1, xhrResponse) : $respond(xhr.status, responseHeaders_1, result);
                            }).catch(function (error) {
                                $respond(400, responseHeaders_1, 'Error while executing operation against the offline database: ' + error);
                            });
                        }
                        else {
                            $respond(xhr.status, responseHeaders_1, xhrResponse);
                        }
                    }
                    else {
                        $respond(xhr.status, responseHeaders_1, xhrResponse);
                    }
                }
            }
            else {
                $respond(xhr.status, defaultContentHeaders, xhrResponse);
            }
        }
    }; // SEND END
    /**
     * Intercept on XHR error!
     */
    SyncXMLHttpRequest.prototype.syncOnError = function () {
        var PROPERTIES = SyncXMLHttpRequest.PROPERTIES;
        this.readyState = this.xhr.readyState;
        if (this.xhr.responseType === '' || this.xhr.responseType === 'text') {
            this[PROPERTIES.RESPONSE_TEXT] = this.xhr.responseText;
        }
        this[PROPERTIES.RESPONSE_TYPE] = this.xhr.responseType;
        this[PROPERTIES.RESPONSE] = this.xhr.response;
        this[PROPERTIES.RESPONSE_XML] = this.xhr.responseXML;
        this[PROPERTIES.STATUS] = this.xhr.status;
        this[PROPERTIES.STATUS_TEXT] = this.xhr.statusText;
    };
    /**
     * Manually set the response to the user.
     *
     * @param status - valid HTTP status code
     * @param headers - response headers
     * @param body - response body
     */
    SyncXMLHttpRequest.prototype.respond2 = function (status, headers, body) {
        var PROPERTIES = SyncXMLHttpRequest.PROPERTIES;
        this._setResponseHeaders(headers);
        this.readyState = this[PROPERTIES.DONE];
        this[PROPERTIES.STATUS] = status;
        this[PROPERTIES.STATUS_TEXT] = SyncXMLHttpRequest.HTTP_STATUS_CODES[status];
        if (body != null) {
            if (typeof body === 'string') {
                this[PROPERTIES.RESPONSE_TEXT] = body;
            }
            else if (typeof body === 'object') {
                if (this[PROPERTIES.RESPONSE_TYPE] && this[PROPERTIES.RESPONSE_TYPE] === 'json') {
                    this[PROPERTIES.RESPONSE] = body;
                }
                else {
                    this[PROPERTIES.RESPONSE_TEXT] = JSON.stringify(body);
                }
            }
            else {
                this[PROPERTIES.RESPONSE_TEXT] = null;
                this[PROPERTIES.RESPONSE] = this[PROPERTIES.RESPONSE_TEXT];
            }
        }
        else {
            this[PROPERTIES.RESPONSE_TEXT] = null;
            this[PROPERTIES.RESPONSE] = this[PROPERTIES.RESPONSE_TEXT];
        }
        if (status !== 0) {
            if (this.originalOnLoad) {
                this.originalOnLoad.call(this);
            }
            else if (this.originalOnReadyState) {
                this.originalOnReadyState.call(this);
            }
            else {
                throw new Error('no response XHR method was implemented!');
            }
        }
        else {
            if (this.originalOnError) {
                this.originalOnError.call(this);
            }
            else if (this.originalOnLoad) {
                this.originalOnLoad.call(this);
            }
            else if (this.originalOnReadyState) {
                this.originalOnReadyState.call(this);
            }
            else {
                throw new Error('no response XHR method was implemented!');
            }
        }
    };
    /**
     * Prototype from the real object to easy catch the internal variables!
     *
     * @param e
     * @returns {*}
     */
    SyncXMLHttpRequest.prototype.onreadystatechangefunction = function () {
        var PROPERTIES = SyncXMLHttpRequest.PROPERTIES;
        var responseHeaders = this.$utils.parseResponseHeaders(this.xhr.getAllResponseHeaders());
        this._setResponseHeaders(responseHeaders);
        this.readyState = this[SyncXMLHttpRequest.PROPERTIES.DONE];
        this[PROPERTIES.STATUS] = this.xhr.status;
        this[PROPERTIES.STATUS_TEXT] = this.xhr.statusText;
        if (this.xhr.responseType === '' || this.xhr.responseType === 'text') {
            this[PROPERTIES.RESPONSE_TEXT] = this.xhr.responseText;
        }
        if (this.persistentPath !== false) {
            this[PROPERTIES.RESPONSE] = this.xhr.response;
            this[PROPERTIES.RESPONSE_XML] = this.xhr.responseXML;
        }
        return;
    };
    /**
     * Convert to the original XHR object!
     *
     * https://github.com/sinonjs/sinon/blob/master/lib/sinon/util/fake_xml_http_request.js
     * https://github.com/sinonjs/sinon/blob/master/lib/sinon/util/event.js
     *
     * @returns {SyncXMLHttpRequest}
     */
    SyncXMLHttpRequest.prototype.defake = function () {
        var _this = this;
        this.logger.debug('sync-express.defake', 'process request by original XMLHttpRequest');
        var PROPERTIES = SyncXMLHttpRequest.PROPERTIES;
        var METHODS = SyncXMLHttpRequest.METHODS;
        var methods = [
            METHODS.SEND,
            METHODS.REMOVE_EVENT_LISTENER,
            METHODS.GET_RESPONSE_HEADER,
            METHODS.GET_ALL_RESPONSE_HEADERS,
            METHODS.DISPATCH_EVENT,
            METHODS.OVERRIDE_MIME_TYPE,
        ];
        methods.forEach(function (method) {
            Object.defineProperty(_this, method, {
                value: function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    return _this.xhr[method].apply(_this.xhr, params);
                },
            });
        });
        var properties = [
            PROPERTIES.READY_STATE,
            PROPERTIES.RESPONSE_TEXT,
            PROPERTIES.RESPONSE,
            PROPERTIES.RESPONSE_TYPE,
            PROPERTIES.RESPONSE_XML,
            PROPERTIES.STATUS,
            PROPERTIES.STATUS_TEXT,
        ];
        properties.forEach(function (item) {
            Object.defineProperty(_this, item, {
                get: function () { return _this.xhr[item]; },
                set: function (obj) { return _this.xhr[item] = obj; },
            });
        });
        return this;
    };
    SyncXMLHttpRequest.PROPERTIES = {
        HEADERS_RECEIVED: 'HEADERS_RECEIVED',
        UPLOAD: 'upload',
        ABORT: 'abort',
        ON_TIMEOUT: 'ontimeout',
        TIMEOUT: 'timeout',
        WITH_CREDENTIALS: 'withCredentials',
        ON_PROGRESS: 'onprogress',
        ON_LOAD_START: 'onloadstart',
        ON_LOAD_END: 'onloadend',
        DONE: 'DONE',
        UNSENT: 'UNSENT',
        LOADING: 'LOADING',
        OPENED: 'OPENED',
        ON_LOAD: 'onload',
        ON_READY_STATE_CHANGE: 'onreadystatechange',
        ON_ERROR: 'onerror',
        ON_ABORT: 'onabort',
        READY_STATE: 'readyState',
        RESPONSE_TEXT: 'responseText',
        RESPONSE: 'response',
        RESPONSE_TYPE: 'responseType',
        RESPONSE_XML: 'responseXML',
        STATUS: 'status',
        STATUS_TEXT: 'statusText',
    };
    SyncXMLHttpRequest.METHODS = {
        SET_REQUEST_HEADER: 'setRequestHeader',
        SEND: 'send',
        ADD_EVENT_LISTENER: 'addEventListener',
        REMOVE_EVENT_LISTENER: 'removeEventListener',
        GET_RESPONSE_HEADER: 'getResponseHeader',
        GET_ALL_RESPONSE_HEADERS: 'getAllResponseHeaders',
        DISPATCH_EVENT: 'dispatchEvent',
        OVERRIDE_MIME_TYPE: 'overrideMimeType',
    };
    SyncXMLHttpRequest.defaultContentTypeHeader = 'application/json; charset=utf-8';
    SyncXMLHttpRequest.HTTP_STATUS_CODES = {
        100: 'Continue',
        101: 'Switching Protocols',
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        203: 'Non-Authoritative Information',
        204: 'No Content',
        205: 'Reset Content',
        206: 'Partial Content',
        300: 'Multiple Choice',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other',
        304: 'Not Modified',
        305: 'Use Proxy',
        307: 'Temporary Redirect',
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Request Entity Too Large',
        414: 'Request-URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Requested Range Not Satisfiable',
        417: 'Expectation Failed',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
    };
    SyncXMLHttpRequest.UNSAFE_HEADERS = {
        'Accept-Charset': true,
        'Accept-Encoding': true,
        Connection: true,
        'Content-Length': true,
        Cookie: true,
        Cookie2: true,
        'Content-Transfer-Encoding': true,
        Date: true,
        Expect: true,
        Host: true,
        'Keep-Alive': true,
        Referer: true,
        TE: true,
        Trailer: true,
        'Transfer-Encoding': true,
        Upgrade: true,
        'User-Agent': true,
        Via: true,
    };
    return SyncXMLHttpRequest;
}());
exports.SyncXMLHttpRequest = SyncXMLHttpRequest;
/**
 *
 * The response object has these properties:

 data – {string|Object} – The response body transformed with the transform functions.
 status – {number} – HTTP status code of the response.
 headers – {function([headerName])} – Header getter function.
 config – {Object} – The configuration object that was used to generate the request.
 statusText – {string} – HTTP status text of the response.
  @ignore
 */
/* A response status code between 200 and 299 is considered a success status and will result in the success callback
 being called. Any response status code outside of that range is considered an error status and will result in the
 error callback being called. Also, status codes less than -1 are normalized to zero. -1 usually means the request
 was aborted, e.g. using a config.timeout. Note that if the response is a redirect, XMLHttpRequest will
 transparently follow it, meaning that the outcome (success or error) will be determined by the final response
 status code.
 */
function xmlHttpRequestInstall(XHR, $sync, $utils, $options, $common, $handler, $events, logger) {
    var OriginalXMLHttpRequest = XHR;
    /**
     * Here decision will be take if to intercept or not:), depending or initialisation settings!
     *
     * @param intercept
     * @returns {SyncXMLHttpRequest}
     * @constructor
     * @ignore
     */
    window['XMLHttpRequest'] = function (intercept) {
        logger.debug('XMLHttpRequest.intercept', intercept);
        if (typeof intercept === 'boolean') {
            if (intercept === true) {
                return new SyncXMLHttpRequest(XHR, $options, $handler, $sync, $common, $utils, $events);
            }
            if (intercept === false) {
                return new OriginalXMLHttpRequest();
            }
        }
        if (!$options.isOn() || $options.off) {
            return new OriginalXMLHttpRequest();
        }
        return new SyncXMLHttpRequest(XHR, $options, $handler, $sync, $common, $utils, $events);
    };
    window['XMLHttpRequest'].originalXMLHttpRequest = OriginalXMLHttpRequest;
}
exports.xmlHttpRequestInstall = xmlHttpRequestInstall;
function xmlHttpRequestUninstall() {
    if (!window['XMLHttpRequest'].originalXMLHttpRequest) {
        throw 'Sync Express is not installed.';
    }
    window['XMLHttpRequest'] = window['XMLHttpRequest'].originalXMLHttpRequest;
}
exports.xmlHttpRequestUninstall = xmlHttpRequestUninstall;


/***/ }),
/* 50 */
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
 * Copyright© 2015, Oracle and/or its affiliates. All rights reserved.
 * Created by Lyudmil Pelov on 07/09/15.
 *
 * Allows to intercept the XHR operations and work directly with the database but using HTTP Methods like
 * Post, Put, Patch, Delete
 *
 * @author Lyudmil Pelov
 */
var request_handler_1 = __webpack_require__(6);
/**
 * Request handler can be used directly, and is used to intercept the HTTP request to store objects offline.
 * @ignore
 * @type {{get, post, put, delete, data, router, flush}}
 */
var GenericRequestHandler = /** @class */ (function (_super) {
    __extends(GenericRequestHandler, _super);
    function GenericRequestHandler(options, common, utils, lokiStorageAdapter) {
        return _super.call(this, 'generic-request', options, common, utils, lokiStorageAdapter) || this;
    }
    GenericRequestHandler.prototype.buildResponseObject = function (obj) {
        return obj;
    };
    GenericRequestHandler.prototype.getResponsePayload = function (response) {
        return response.data;
    };
    GenericRequestHandler.prototype.getModuleName = function () {
        return 'Generic';
    };
    GenericRequestHandler.prototype.setPayloadSingleObject = function (newObject, payload) {
        if (this.$common.isArray(payload)) {
            this.$common.extendOwn(newObject, payload[0]);
        }
        else if (this.$common.isObject(payload) && !this.$common.isFunction(payload)) {
            this.$common.extendOwn(newObject, payload);
        }
    };
    /**
     * if we have attributed then the first one should be the key we look for!
     * @deprecated - use buildNestedPropertyArrayParams
     */
    GenericRequestHandler.prototype.createObjFromUrlParameters = function (keyValueObj, queryParams, payload) {
        var newObject = keyValueObj;
        if (queryParams.attr.length > 1) {
            var nestedProperty = '';
            for (var i = 1; i < queryParams.attr.length; i++) {
                if (queryParams.attr[i].is) {
                    this.$utils.setData(queryParams.attr[i].name, queryParams.attr[i].value, newObject);
                }
                else {
                    if (nestedProperty.length > 0)
                        nestedProperty += '.' + queryParams.attr[i].value;
                    else
                        nestedProperty += queryParams.attr[i].value;
                    this.$utils.setData(nestedProperty, {}, newObject);
                }
            }
        }
        else {
        }
        this.setPayloadSingleObject(newObject, payload);
        return newObject;
    };
    /**
     * @deprecated - use buildNestedPropertyArrayParams
     */
    GenericRequestHandler.prototype.createObjFromUrlParametersForEdit = function (keyValueObj, queryParams, payload) {
        var newObject = keyValueObj;
        if (queryParams.attr.length > 1) {
            var nestedProperty = '';
            for (var i = 1; i < queryParams.attr.length; i++) {
                if (queryParams.attr[i].is) {
                    this.$utils.setData(queryParams.attr[i].name, queryParams.attr[i].value, newObject);
                }
                else {
                    if (nestedProperty.length > 0)
                        nestedProperty += '.' + queryParams.attr[i].value;
                    else
                        nestedProperty += queryParams.attr[i].value;
                    this.$utils.setData(nestedProperty, {}, newObject);
                }
            }
            if (nestedProperty.length > 0) {
                this.$utils.setData(nestedProperty, payload, newObject);
            }
            return newObject;
        }
        return payload;
    };
    return GenericRequestHandler;
}(request_handler_1.RequestHandler));
exports.GenericRequestHandler = GenericRequestHandler;


/***/ }),
/* 51 */
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
var db_1 = __webpack_require__(9);
var logger_1 = __webpack_require__(1);
/**
 * Internal events, which could be user from outside!
 * @ignore
 * @type {{changes: Array, warning: Array}}
 */
var InternEventEmitter /* extends PersistenceEventEmitter*/ = /** @class */ (function () {
    function InternEventEmitter() {
        this.events = {
            'pre-put': [],
            'pre-patch': [],
            'pre-post': [],
            'pre-get': [],
            'pre-delete': [],
            'pre-sync': [],
            'post-sync': [],
            'error-sync': [],
            'end-sync': [],
        };
    }
    InternEventEmitter.prototype.emit = function (one, two) {
    };
    return InternEventEmitter;
}());
exports.InternEventEmitter = InternEventEmitter;
/**
 * Custom XHR internal error message!
 *
 * @param message - error message
 * @param code - http code
 * @param response - payload response
 * @constructor
 * @ignore
 */
var XhrError = /** @class */ (function (_super) {
    __extends(XhrError, _super);
    function XhrError(message, status, response, headers) {
        var _this = _super.call(this, message || 'Error during XHR2 execution') || this;
        _this.name = 'XhrError';
        _this.status = status || 0;
        _this.response = response || '';
        _this.headers = headers || {};
        return _this;
    }
    return XhrError;
}(Error));
/**
 * This inner class which will handle the transaction sync
 * @ignore
 * @type {{run, stop, status, reset}}
 */
var SyncQueue = /** @class */ (function () {
    function SyncQueue(sync, syncProcess, $options) {
        this.sync = sync;
        this.syncProcess = syncProcess;
        this.$options = $options;
        this.$queue = [];
        this.$index = 0;
        this.$stopSync = false;
        this.$isRunning = false;
        this.$forceRun = false;
        this.logger = new logger_1.Logger('SyncQueue');
        this.$defaultDelay = $options.syncTimeOut;
    }
    /**
     * Process given object, this is where we will execute the operation!
     */
    SyncQueue.prototype.process = function (obj) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.syncProcess.process(obj)
                    .then(function () { return resolve(true); })
                    .catch(function (e) { return reject(e); });
            }
            catch (e) {
                _this.logger.error(e);
                reject(e);
            }
        });
    };
    /**
     * Execs all pending sync transactions, one by one, as stored in the transaction table!
     *
     */
    SyncQueue.prototype.next = function () {
        var _this = this;
        if (this.$stopSync)
            return;
        var lockState = this.sync.checkAndWaitUntilDbTransactionFinish();
        if (lockState === -1) {
            this.logger.warn('sync db lock not released, restart the sync process!');
            this.next();
            return;
        }
        else if (lockState === 0) {
            this.next();
            return;
        }
        var i = this.$index++;
        var nextObj = this.$queue[this.$index];
        this.sync._syncObj = this.$queue[i];
        this.logger.debug(this.$queue);
        if (!this.sync._syncObj) {
            this.rerun();
            return;
        }
        this.process(this.sync._syncObj)
            .then(function () { return _this.doNext(nextObj, _this.sync._syncObj) && setTimeout(_this.next.bind(_this), 1); })
            .catch(function (error) {
            _this.logger.debug('unknown sync process error', error);
            _this.rerun(); // L.Pelov - fix to make possible that sync will rerun if error!
        });
    };
    SyncQueue.prototype.runSync = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (this.$options.off)
            return;
        if (!force && typeof force !== 'boolean')
            force = false;
        if (this.$options.autoSync === false && force === false)
            return;
        if (!this.$options.isOnline()) {
            this.rerun();
            return;
        }
        if (this.$isRunning) {
            this.$forceRun = true;
            return;
        }
        setTimeout(function () {
            _this.$isRunning = true;
            _this.$stopSync = false;
            _this.sync.startSyncTransaction();
            _this.$queue = _this.sync.getSyncLog().find();
            try {
                _this.next();
            }
            catch (e) {
                _this.logger.debug(e);
                _this.rerun();
            }
        }, this.getDelay(force));
    };
    SyncQueue.prototype.doNext = function (obj, lastObj) {
        if (obj)
            return true;
        this.rerun();
        this.sync._moduleEventEmitter.emit('end-sync', lastObj);
        return false;
    };
    SyncQueue.prototype.rerun = function () {
        this.sync._syncObj = {};
        this.reset();
        setTimeout(this.runSync.bind(this), this.getDelay());
    };
    SyncQueue.prototype.stop = function () {
        this.sync.stopSyncTransaction();
        this.$stopSync = true;
        this.$isRunning = false;
    };
    SyncQueue.prototype.reset = function () {
        this.stop();
        this.$isRunning = false;
        this.$index = 0;
        this.$queue.length = 0;
    };
    SyncQueue.prototype.status = function () {
        return {
            current: this.$index,
            obj: this.$queue[this.$index],
            size: this.$queue.length,
            isRunning: this.$isRunning,
        };
    };
    /**
     * Defines how often to repeat the process, auto-sync!
     * @param force
     * @returns {*}
     */
    SyncQueue.prototype.getDelay = function (force) {
        if (force === void 0) { force = false; }
        if (force) {
            return 1;
        }
        if (this.$forceRun) {
            this.$isRunning = false; // L.Pelov - fix 05.08.2016
            this.$forceRun = false;
            return 1;
        }
        if (this.sync._syncLogDirty) {
            this.sync._syncLogDirty = false;
            return 1;
        }
        return this.$defaultDelay;
    };
    return SyncQueue;
}());
exports.SyncQueue = SyncQueue;
/**
 * Proceed XHR operation against a given sync obj
 * @ignore
 * @type {{run}}
 */
var SyncProcess = /** @class */ (function () {
    function SyncProcess(sync, $options, $handler, $utils) {
        this.sync = sync;
        this.$options = $options;
        this.$handler = $handler;
        this.$utils = $utils;
        this.logger = new logger_1.Logger('SyncProcess');
    }
    SyncProcess.prototype.storeError = function (obj, message, code, response) {
        if (!Array.isArray(this.sync._syncObj.$error)) {
            obj.$error = [];
        }
        if (obj.$error.length > this.$options.maxSyncAttempts) {
            obj.$error.shift();
        }
        obj.$error.push({
            status: code || 0,
            response: response || [],
            message: message || 'Unknown error',
        });
        obj.$errorcounter = obj.$error.length;
        this.sync.getSyncLog().update(obj);
    };
    SyncProcess.prototype.onError = function (xhr, obj) {
        try {
            this.logger.error(xhr, obj);
            if (!(xhr instanceof XMLHttpRequest)) {
                if ('SYNCID' in obj) {
                    this.$handler.dispatchInternEvent(400, 'Bad Request', xhr, obj.SYNCID);
                }
                this.logger.error('unknown XHR error during the sync process');
                return true;
            }
            if ('SYNCID' in obj) {
                this.$handler.dispatchInternEvent(xhr.status, xhr.statusText, xhr, obj.SYNCID);
            }
            var response = this.$utils.getXHRResponse(xhr) || [];
            this.sync._moduleEventEmitter.emit('error-sync', {
                response: response,
                status: xhr.status || 0,
                message: xhr.statusText || 'Unknown error',
            });
            this.storeError(obj, xhr.statusText, xhr.status, response);
        }
        catch (e) {
            this.logger.error(e);
        }
        finally {
            return true;
        }
    };
    SyncProcess.prototype.removeAfterReachHighCount = function (obj) {
        var _this = this;
        if (this.$options.autoRemoveAfterReachMaxAttemps === true) {
            new Promise(function (resolve) { return resolve(_this.sync.removeSyncEntry(obj)); })
                .catch(function (err) { return _this.onError(err.message, 0); });
        }
    };
    SyncProcess.prototype.onSuccess = function (obj, xhr) {
        var response = {
            status: xhr.status,
            statusText: xhr.statusText,
            response: this.$utils.getXHRResponse(xhr),
            headers: xhr.getAllResponseHeaders(),
            syncObj: obj,
        };
        this.sync._moduleEventEmitter.emit('post-sync', response);
        if ('SYNCID' in obj) {
            this.$handler.dispatchInternEvent(response.status, response.statusText, xhr, obj.SYNCID);
        }
        return response;
    };
    /**
     * Process method parameter
     * @callback Persistence.Sync~processParam
     * @param url {String}.
     * @param headers {Array}.
     * @param data {Object}.
     * @param method {String} GTE, POST, DELETE.
     */
    /**
     * Proceed XHR call with the object data
     * @param [obj] {Persistence.Sync~processParam} From the sync transaction log
     * @return {Promise<boolean>}
     */
    SyncProcess.prototype.process = function (obj) {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.$options.maxSyncAttempts === 0 || ((obj.$errorcounter || 0) <= _this.$options.maxSyncAttempts)) {
                _this.logger.debug('process', obj);
                _this.sync._moduleEventEmitter.emit('pre-sync', obj);
                var cleanDbObject = _this.sync.cleanSyncLogObjectFromDBSpecificProperties(obj, true);
                _this.sync.syncXhr2(cleanDbObject.method, cleanDbObject.url, cleanDbObject.headers, cleanDbObject.data, cleanDbObject.responseType, _this.$options.syncTimeOut)
                    .then(_this.onSuccess.bind(_this, obj))
                    .then(function (response) {
                    _this.sync.removeSyncEntry(obj);
                    return response;
                })
                    .then(_this.$options.module.postSuccessOperations.bind(_this.$options.module))
                    .catch(function (e) { return _this.onError(e, obj); })
                    .then(function () { return resolve(true); });
            }
            else {
                _this.removeAfterReachHighCount(obj);
                resolve(true);
            }
        });
    };
    return SyncProcess;
}());
exports.SyncProcess = SyncProcess;
/**
 * This module provides the sync capabilities of the persistence library. It makes sure that POST, PUT, and DELETE
 * operations will be merged. This module is equal as singleton, it will be init only once even used in several locations
 *
 * @type {{getHistory, get, post, put, delete, sync, forceSync, removeSync, flush, clear}}
 * @return {{getDB: Persistence.Sync.getDB, getHistory: Persistence.Sync.getHistory, get: Persistence.Sync.get,
 * post: Persistence.Sync.post, put: Persistence.Sync.put, delete: Persistence.Sync.delete,
 * router: Persistence.Sync.router, sync: handleSync, run: syncWithoutWorker, forceSync: Persistence.Sync.forceSync,
 * operations: {run, stop, status, reset}, removeSync: Persistence.Sync.removeSync, flush: deleteAll,
 * clear: Persistence.Sync.clear, events: internEventEmitter, isSyncRunning: statusSyncTransaction}}
 * @ignore
 */
var Sync = /** @class */ (function () {
    function Sync($events, $common, $options, $utils, $handler, lokiStorageAdapter) {
        var _this = this;
        this.$events = $events;
        this.$common = $common;
        this.$options = $options;
        this.$utils = $utils;
        this.$handler = $handler;
        this._syncRuns = false;
        this._isDBTransaction = false;
        this._defaultDBDelay = 2000; // 2secs because ajax operations could take some time!
        this._syncLogDirty = false; // in case db operations during the sync operation
        this.dbname = 'sync';
        this._moduleEventEmitter = new InternEventEmitter();
        this._dbTransactionLockCounter = 0;
        this.logger = new logger_1.Logger('Sync');
        this.logHTTP = false;
        this.logger.info('Sync.constructor');
        this.prefix = $options.dbPrefix;
        /**
         * Init the DB
         * @type {{getDB, getCollection, getCollectionByName, getCollections, save, close, flush}}
         * @private
         */
        this.$db = new db_1.DB(this.prefix + '.' + this.dbname, $options, lokiStorageAdapter);
        $options.onDbPrefixChange = function (oldVal, newVal) {
            _this.$db = new db_1.DB(newVal + '.' + _this.dbname, _this.$options, lokiStorageAdapter);
        };
        var syncProcess = new SyncProcess(this, this.$options, this.$handler, this.$utils);
        this.operations = new SyncQueue(this, syncProcess, this.$options);
    }
    Sync.prototype._setLogHTTP = function (logHTTP) {
        this.logHTTP = logHTTP;
    };
    /**
     * Get collection reference from the sync log.
     *
     * @param collection
     * @returns {*}
     */
    Sync.prototype.getSyncLog = function (collection) {
        return this.$db.getCollectionByName(collection);
    };
    /**
     * Marks when db operation starts
     */
    Sync.prototype.startDBTransaction = function () {
        return this._isDBTransaction = true;
    };
    /**
     * Finish the db operation
     */
    Sync.prototype.commitDBTransaction = function (isError) {
        if (!isError)
            this._syncLogDirty = true;
        return this._isDBTransaction = false;
    };
    /**
     * Check if there is DB transaction status!
     * @returns {boolean}
     */
    Sync.prototype.isDBTransaction = function () {
        return this._isDBTransaction;
    };
    /**
     * Lock function, which will stop execution and repeat operation until db operation is released!
     *
     * @returns {number} - 1: when the lock is released,
     * -1 if more then 10 times the lock was not released,
     * 1 - if released
     * @type {number}
     */
    Sync.prototype.checkAndWaitUntilDbTransactionFinish = function () {
        this._dbTransactionLockCounter += this._dbTransactionLockCounter;
        if (this.isDBTransaction() === true) {
            if (this._dbTransactionLockCounter > 10) {
                this._dbTransactionLockCounter = 0;
                return -1; // this means we tries 10times and lock was not releases
            }
            return 0; // this pending
        }
        else {
            this._dbTransactionLockCounter = 0;
            return 1;
        }
    };
    /**
     * Check if the given object is suitable for the sync log.
     *
     * @param options
     * @returns {boolean}
     */
    Sync.prototype.isSyncRequest = function (options) {
        if (this.$common.isEmpty(options)) {
            throw new Error('sync options is empty object, cannot be synced!');
        }
        if (!options.hasOwnProperty('url')) {
            throw new Error('options.url was not specified!');
        }
        else {
            if (this.$common.isEmpty(options.url)) {
                throw new Error('options.url cannot be empty!');
            }
        }
        if (!options.hasOwnProperty('headers')) {
            throw new Error('options.headers were not specified!');
        }
        else {
            if (!this.$common.isObject(options.headers)) {
                throw new Error('options.headers is not a objects!');
            }
        }
        if (!options.hasOwnProperty('data')) {
            throw new Error('options.data was not specified!');
        }
        else {
            if (this.$common.isEmpty(options.data)) {
                throw new Error('options.data cannot be empty object!');
            }
            if (!this.$common.isObject(options.data)) {
                throw new Error('options.data is not a object!');
            }
        }
        return true;
    };
    /**
     * Check if the provided request is suitable to be used as delete sync request. The major difference here,
     * that we do not check for data in the payload, as this is not required for the delete call!
     *
     * @param options
     * @returns {boolean}
     */
    Sync.prototype.isDeleteSyncRequest = function (options) {
        if (this.$common.isEmpty(options)) {
            throw new Error('sync options is empty object, cannot be synced!');
        }
        if (!options.hasOwnProperty('url')) {
            throw new Error('options.url was not specified!');
        }
        else {
            if (this.$common.isEmpty(options.url)) {
                throw new Error('options.url cannot be empty!');
            }
        }
        if (!options.hasOwnProperty('headers')) {
            throw new Error('options.headers were not specified!');
        }
        else {
            if (!this.$common.isObject(options.headers)) {
                throw new Error('options.headers is not a objects!');
            }
        }
        return true;
    };
    /**
     * buildDBObjectFindQuery result
     * @callback Persistence.Sync~buildDBObjectFindQueryReturn
     * @param dbquery {String}.
     * @param url {String}.
     * @param queryUrl {String}.
     */
    /**
     * Internal function only! Builds the query based on URL or Payload data, or if non of them provided based on
     * the internal db key.
     *
     * @param requestOptions - make sure that you check the object if correct before pass it here!
     * @returns {Persistence.Sync~buildDBObjectFindQueryReturn}
     * @deprecated - this should be inside the parsing payload module!
     */
    Sync.prototype.buildDBObjectFindQuery = function (requestOptions) {
        var url = this.isURLConfiguredForPersistence(requestOptions.url, true);
        var dbQuery = {};
        if (!this.$common.isEmpty(url.params) && this.$options.Module.getModuleName() !== 'MCS') {
            var key = 'data.' + url.params[0].name; // Object.keys(url.params)[0];
            var value = (url.tokens[0].pattern.indexOf('\d') >= 0) ? parseInt(url.params[0].value, 10) : url.params[0].value + '';
            dbQuery[key] = {
                $eq: value,
            };
        }
        else if (url.tokens.length > 0 && this.$options.Module.getModuleName() !== 'MCS') {
            var keyNameToCompare = url.tokens[0].name;
            if ('data' in requestOptions && keyNameToCompare in requestOptions.data) {
                var key = 'data.' + keyNameToCompare;
                dbQuery[key] = {
                    $eq: requestOptions.data[keyNameToCompare],
                };
            }
        }
        else if ('data' in requestOptions && '$loki' in requestOptions.data && typeof (requestOptions.data.$loki) === 'number' && !isNaN(requestOptions.data.$loki)) {
            var key = 'data.$loki';
            dbQuery[key] = {
                $eq: requestOptions.data.$loki,
            };
        }
        else if ('$loki' in requestOptions && typeof (requestOptions.$loki) === 'number' && !isNaN(requestOptions.$loki)) {
            dbQuery = {
                $loki: {
                    $eq: requestOptions.$loki,
                },
            };
        }
        else {
        }
        return {
            dbquery: dbQuery,
            url: url.path,
            queryUrl: url,
        };
    };
    /**
     * Internal function checks if the given URL is configured for persistence and returns
     * the parsed objects from it.
     *
     * @param path
     * @param returnUrl - boolean, if true it will return the URL properties frm the regex config, otherwise will extract the url directly for you
     * @returns {*}
     */
    Sync.prototype.isURLConfiguredForPersistence = function (path, returnUrl) {
        if (returnUrl === void 0) { returnUrl = false; }
        var persistentPath = this.$options.isPersistentUrl(path);
        if (persistentPath === false) {
            this.logger.error('give url not configured for persistence', path);
            throw new Error('give url not configured for persistence:' + path);
        }
        if (!returnUrl) {
            return persistentPath;
        }
        return persistentPath;
    };
    /**
     * Stores HTTP GET request in the sync log.
     *
     * NOTE: Get is always new entry in the DB, it doesn't matter if the sync runs or not!
     * @returns {*}
     * @param requestOptions
     */
    Sync.prototype.handleGet = function (requestOptions) {
        this.logger.info('handleGet', requestOptions);
        if (this.$common.isEmpty(requestOptions)) {
            throw new Error('sync options is empty object, cannot be synced!');
        }
        if (!requestOptions.hasOwnProperty('url')) {
            throw new Error('options.url was not specified!');
        }
        else if (this.$common.isEmpty(requestOptions.url)) {
            throw new Error('options.url cannot be empty!');
        }
        if (!requestOptions.hasOwnProperty('headers')) {
            throw new Error('request headers were not specified!');
        }
        if (!this.$common.isEmpty(requestOptions.data)) {
            requestOptions.data = {};
        }
        requestOptions['method'] = 'GET';
        this._moduleEventEmitter.emit('pre-get', requestOptions);
        return this.getSyncLog().insert(requestOptions);
    };
    /**
     * Create new object
     * NOTE: Each time you call POST, you will create new object! If you want to update object use PUT!
     * NOTE: This will always create new element, independent from the sync runs!
     *
     * @param requestOptions
     * @returns {*}
     */
    Sync.prototype.handlePost = function (requestOptions) {
        this.logger.info('Sync.handlePost', requestOptions);
        this.isSyncRequest(requestOptions);
        var query = this.isURLConfiguredForPersistence(requestOptions.url);
        if ('$loki' in requestOptions && typeof (requestOptions.$loki) === 'number' && !isNaN(requestOptions.$loki)) {
            delete requestOptions.$loki;
        }
        requestOptions['method'] = 'POST';
        requestOptions['URI'] = query.root;
        this._moduleEventEmitter.emit('pre-post', requestOptions);
        return this.getSyncLog().insert(requestOptions);
    };
    /**
     * Update existing object in the sync log!
     *
     * @param requestOptions
     */
    Sync.prototype.handlePut = function (requestOptions) {
        this.logger.info('Sync.handlePut', requestOptions);
        this.isSyncRequest(requestOptions);
        var urlParsedObjects = this.buildDBObjectFindQuery(requestOptions);
        var _syncLog = this.getSyncLog(); // query.root
        this._moduleEventEmitter.emit('pre-put', requestOptions);
        if (this.$common.isEmpty(urlParsedObjects.dbquery)) {
            requestOptions['method'] = 'PUT';
            requestOptions['URI'] = urlParsedObjects.queryUrl.root;
            return _syncLog.insert(requestOptions);
        }
        var _findInHistory = _syncLog.findOne({
            $and: [
                urlParsedObjects.dbquery,
                {
                    method: 'POST',
                }, {
                    URI: urlParsedObjects.queryUrl.root,
                }
            ],
        });
        if (_findInHistory) {
            if (this._syncObj && !this.$common.isEmpty(this._syncObj)) {
                if ('$loki' in this._syncObj && this._syncObj.$loki === _findInHistory.$loki) {
                    setTimeout(this.handlePut.bind(this, requestOptions), this._defaultDBDelay);
                }
            }
            this.$common.extendOwn(_findInHistory.data, requestOptions.data);
            this.$common.extendOwn(_findInHistory.headers, requestOptions.headers);
            _findInHistory.$errorcounter = 0;
            return _syncLog.update(_findInHistory);
        }
        _findInHistory = _syncLog.findOne({
            $and: [
                urlParsedObjects.dbquery,
                {
                    method: 'PUT',
                }, {
                    URI: urlParsedObjects.queryUrl.root,
                }
            ],
        });
        if (_findInHistory) {
            if (this._syncObj && !this.$common.isEmpty(this._syncObj)) {
                if ('$loki' in this._syncObj && this._syncObj.$loki === _findInHistory.$loki) {
                    setTimeout(this.handlePut.bind(this, requestOptions), this._defaultDBDelay);
                }
            }
            this.$common.extendOwn(_findInHistory, requestOptions);
            _findInHistory.$errorcounter = 0;
            return _syncLog.update(_findInHistory);
        }
        requestOptions['method'] = 'PUT';
        requestOptions['URI'] = urlParsedObjects.queryUrl.root;
        return _syncLog.insert(requestOptions);
    };
    /**
     * Update existing object in the sync log!
     *
     * @param requestOptions
     */
    Sync.prototype.handlePatch = function (requestOptions) {
        this.logger.info('Sync.handlePatch', requestOptions);
        this.isSyncRequest(requestOptions);
        var urlParsedObjects = this.buildDBObjectFindQuery(requestOptions);
        var _syncLog = this.getSyncLog(); // query.root
        this._moduleEventEmitter.emit('pre-patch', requestOptions);
        if (this.$common.isEmpty(urlParsedObjects.dbquery)) {
            requestOptions['method'] = 'PATCH';
            requestOptions['URI'] = urlParsedObjects.queryUrl.root;
            return _syncLog.insert(requestOptions);
        }
        var _findInHistory = _syncLog.findOne({
            $and: [
                urlParsedObjects.dbquery,
                {
                    method: 'POST',
                }, {
                    URI: urlParsedObjects.queryUrl.root,
                }
            ],
        });
        if (_findInHistory) {
            if (this._syncObj && !this.$common.isEmpty(this._syncObj)) {
                if ('$loki' in this._syncObj && this._syncObj.$loki === _findInHistory.$loki) {
                    setTimeout(this.handlePut.bind(this, requestOptions), this._defaultDBDelay);
                }
            }
            this.$common.extendOwn(_findInHistory.data, requestOptions.data);
            this.$common.extendOwn(_findInHistory.headers, requestOptions.headers);
            _findInHistory.$errorcounter = 0;
            return _syncLog.update(_findInHistory);
        }
        _findInHistory = _syncLog.findOne({
            $and: [
                urlParsedObjects.dbquery,
                {
                    method: 'PATCH',
                }, {
                    URI: urlParsedObjects.queryUrl.root,
                }
            ],
        });
        if (_findInHistory) {
            if (this._syncObj && !this.$common.isEmpty(this._syncObj)) {
                if ('$loki' in this._syncObj && this._syncObj.$loki === _findInHistory.$loki) {
                    setTimeout(this.handlePatch.bind(this, requestOptions), this._defaultDBDelay);
                }
            }
            this.$common.extendOwn(_findInHistory, requestOptions);
            _findInHistory.$errorcounter = 0;
            return _syncLog.update(_findInHistory);
        }
        requestOptions['method'] = 'PATCH';
        requestOptions['URI'] = urlParsedObjects.queryUrl.root;
        return _syncLog.insert(requestOptions);
    };
    /**
     * Delete object from the sync log
     * @param requestOptions
     */
    Sync.prototype.handleDelete = function (requestOptions) {
        this.logger.info('Sync.handleDelete', requestOptions);
        this.isDeleteSyncRequest(requestOptions);
        var urlParsedObjects = this.buildDBObjectFindQuery(requestOptions);
        this._moduleEventEmitter.emit('pre-delete', requestOptions);
        var _syncLog = this.getSyncLog(); // query.root
        if (this.$common.isEmpty(urlParsedObjects.dbquery)) {
            requestOptions['method'] = 'DELETE';
            requestOptions['URI'] = urlParsedObjects.queryUrl.root;
            return _syncLog.insert(requestOptions);
        }
        var _findInHistory = _syncLog.findOne({
            $and: [
                urlParsedObjects.dbquery,
                {
                    URI: urlParsedObjects.queryUrl.root,
                },
                {
                    method: {
                        $eq: 'POST',
                    },
                }
            ],
        });
        if (_findInHistory) {
            if (this._syncObj && !this.$common.isEmpty(this._syncObj)) {
                if ('$loki' in this._syncObj && this._syncObj.$loki === _findInHistory.$loki) {
                    setTimeout(this.handleDelete.bind(this, requestOptions), this._defaultDBDelay);
                }
            }
            return _syncLog.remove(_findInHistory);
        }
        _findInHistory = _syncLog.findOne({
            $and: [
                urlParsedObjects.dbquery,
                {
                    URI: urlParsedObjects.queryUrl.root,
                },
                {
                    method: {
                        $eq: 'PUT',
                    },
                }
            ],
        });
        if (_findInHistory) {
            if (this._syncObj && !this.$common.isEmpty(this._syncObj)) {
                if ('$loki' in this._syncObj && this._syncObj.$loki === _findInHistory.$loki) {
                    setTimeout(this.handleDelete.bind(this, requestOptions), this._defaultDBDelay);
                }
            }
            _findInHistory['url'] = requestOptions['url'];
            _findInHistory['method'] = 'DELETE';
            _findInHistory['URI'] = urlParsedObjects.queryUrl.root;
            if ('data' in requestOptions) {
                _findInHistory['data'] = requestOptions['data'];
            }
            _findInHistory.$errorcounter = 0;
            return _syncLog.update(_findInHistory);
        }
        requestOptions['method'] = 'DELETE';
        requestOptions['URI'] = urlParsedObjects.queryUrl.root;
        return _syncLog.insert(requestOptions);
    };
    /**
     * If sync operation for specific entry successful finished, remove the entry from the sync log table!
     *
     * @param request
     * @returns {*}
     */
    Sync.prototype.removeSyncEntry = function (request) {
        if (this.$common.isEmpty(request)) {
            throw new Error('removeSync(request) is empty cannot be removed from the sync log!');
        }
        if (!this.$common.isObject(request)) {
            throw new Error('removeSync(request) is not a object!');
        }
        if (!request.hasOwnProperty('url')) {
            throw new Error('request.url was not specified!');
        }
        else {
            if (this.$common.isEmpty(request.url)) {
                throw new Error('request.url cannot be empty!');
            }
        }
        if (!('$loki' in request && typeof (request.$loki) === 'number' && !isNaN(request.$loki))) {
            throw new Error('removeSync(request.$loki) does not exist to be able to be removed from the sync table!');
        }
        var _syncLogCollection = this.getSyncLog();
        var _findInSyncLog = _syncLogCollection.findOne({ $loki: request.$loki });
        if (_findInSyncLog) {
            return _syncLogCollection.remove(_findInSyncLog);
        }
        return;
    };
    /**
     * Uses XHR2 standard to execute ajax call to the backend server. In modern browser since IE9 all browsers
     * support XHR2, no polyfill required!
     *
     * @param method - http method, like POST, GET and son
     * @param url - to the backend server
     * @param headers - available headers
     * @param data
     * @param timeout
     * @returns {*}
     */
    Sync.prototype.syncXhr2 = function (method, url, headers, data, responseType, timeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.$options.oneOff();
            var xhr = new XMLHttpRequest();
            if ('withCredentials' in xhr) {
                xhr.withCredentials = true;
            }
            if (responseType) {
                xhr.responseType = responseType;
            }
            xhr.open(method, url, true);
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    var obj = headers[key];
                    xhr.setRequestHeader(key, obj);
                }
            }
            if (!headers['Oracle-Mobile-Client-SDK-Info']) {
                var infoHeader = _this.$options.isCordova ? 'Cordova' : 'Web';
                infoHeader += ' 18.3.3.0';
                infoHeader += ' [SyncExpress]';
                xhr.setRequestHeader('Oracle-Mobile-Client-SDK-Info', infoHeader);
            }
            xhr.timeout = timeout || _this.$options.timeout;
            xhr.ontimeout = function (e) {
                _this.logger.error('sync.xhr.ontimeout', e);
                _this.$events.$emit('timeout', {
                    event: e,
                });
                reject(new TypeError('Timeout during XHR load'));
            };
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (_this.logHTTP) {
                        var object = {
                            headers: xhr.getAllResponseHeaders(),
                            body: xhr.responseType === '' || xhr.responseType === 'text' ? xhr.responseText : xhr.response,
                        };
                        _this.logger.debug('Received ' + method + ' response from ' + url, object);
                    }
                    resolve(xhr);
                }
                else {
                    reject(xhr);
                }
            };
            xhr.onerror = function () {
                _this.logger.debug('sync.xhr.onerror', xhr);
                _this.$events.$emit('error', {
                    event: xhr,
                });
                reject(xhr);
            };
            if (_this.logHTTP) {
                var object = {
                    headers: headers,
                    body: data,
                };
                _this.logger.debug('Sent ' + method + ' request to ' + url, object);
            }
            xhr.send((!data || typeof data === 'undefined' || data == null || method === 'DELETE') ? null : JSON.stringify(data));
        });
    };
    /**
     * Makes sure that it cleans the sync log object form the database form DB specific arguments.
     *
     * @param [obj] {Object} Should be passed by value!
     * @param [cloneObject] {Boolean} Value to notify if object should be clone!
     */
    Sync.prototype.cleanSyncLogObjectFromDBSpecificProperties = function (obj, cloneObject) {
        var _obj = cloneObject ? JSON.parse(JSON.stringify(obj)) : obj;
        if ('data' in _obj && _obj.data != null) {
            if (this.$common.isObject(_obj.data) && !this.$common.isEmpty(_obj.data)) {
                if ('$loki' in _obj.data && typeof (_obj.data.$loki) === 'number' && !isNaN(_obj.data.$loki)) {
                    delete _obj.data.$loki;
                }
                if ('meta' in _obj.data) {
                    delete _obj.data.meta;
                }
                for (var _i = 0, _a = _obj.data; _i < _a.length; _i++) {
                    var property = _a[_i];
                    if (this.$common.stringStartsWith(property, '$mcs$')) {
                        delete _obj.data[property];
                    }
                }
            }
        }
        return _obj;
    };
    /**
     * Completely delete all data for given collection path, or in case empty flush for all collections
     * @param path - url path to try to get specific collection to delete if empty remove all collections data
     */
    Sync.prototype.flushCollection = function (path) {
        var _this = this;
        this.logger.info('Persistence.Sync.flush()', path);
        if (this.$common.isEmpty(path)) {
            return this.$db.flush();
        }
        else {
            var query_1 = this.isURLConfiguredForPersistence(path);
            return new Promise(function (resolve, reject) {
                if (_this._syncRuns === true) {
                    reject(new Error('unable to proceed with this operation, sync is in process'));
                }
                else {
                    resolve(_this.getSyncLog(query_1.root).removeDataOnly());
                }
            });
        }
    };
    /**
     * Mark flag that transaction is in execution.
     */
    Sync.prototype.startSyncTransaction = function () {
        this._syncRuns = true;
    };
    /**
     * Stop current transaction execution
     */
    Sync.prototype.stopSyncTransaction = function () {
        this._syncRuns = false;
    };
    /**
     * Current sync status.
     *
     * @returns {boolean} - true if it is running, otherwise false
     */
    Sync.prototype.statusSyncTransaction = function () {
        return this._syncRuns;
    };
    /**
     * If you pass the promises,
     * it will make sure that it change the transation flag before return the promise to the client
     * @param resolve
     * @param reject
     * @param promise
     */
    Sync.prototype.responsePromise = function (resolve, reject, promise) {
        var _this = this;
        promise.then(function (result) {
            _this.commitDBTransaction(false);
            resolve(result);
        }).catch(function (err) {
            _this.commitDBTransaction(true);
            _this.logger.error(err);
            reject(err);
        });
    };
    Sync.prototype.getDB = function () {
        return this.$db;
    };
    /**
     * This is not save, it will always return the collection to the caller, so you can remove entries even
     * during the sync is running!
     *
     * @param options
     */
    Sync.prototype.getHistory = function (options) {
        var _this = this;
        return new Promise(function (resolve) { return resolve(_this.getSyncLog(options)); });
    };
    Sync.prototype.get = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.startDBTransaction();
            var promise = new Promise(function (_resolve) {
                _resolve(_this.handleGet(options));
            });
            _this.responsePromise(resolve, reject, promise);
        });
    };
    Sync.prototype.post = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.startDBTransaction();
            var promise = new Promise(function (_resolve) {
                _resolve(_this.handlePost(options));
            });
            _this.responsePromise(resolve, reject, promise);
        });
    };
    Sync.prototype.put = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.startDBTransaction();
            var promise = new Promise(function (_resolve) {
                _resolve(_this.handlePut(options));
            });
            _this.responsePromise(resolve, reject, promise);
        });
    };
    Sync.prototype.patch = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.startDBTransaction();
            var promise = new Promise(function (_resolve) {
                _resolve(_this.handlePatch(options));
            });
            _this.responsePromise(resolve, reject, promise);
        });
    };
    Sync.prototype.delete = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.startDBTransaction();
            var promise = new Promise(function (_resolve) {
                _resolve(_this.handleDelete(options));
            });
            _this.responsePromise(resolve, reject, promise);
        });
    };
    Sync.prototype.router = function (options) {
        var _this = this;
        var routing = function (options) {
            if (_this.$common.isEmpty(options)) {
                _this.logger.error('sync router request was not provided!', options);
                throw new Error('sync router request was not provided!');
            }
            if (!options.hasOwnProperty('method') && !_this.$common.isEmpty(options.method)) {
                _this.logger.error('sync router method was not provided!', options);
                throw new Error('sync router method was not provided!');
            }
            var _options = _this.$common.clone(options);
            _options.method = _this.$utils._normalizeMethod(_options.method);
            if (!_this[_options.method]) {
                _this.logger.error('specified router is not implemented!');
                throw new Error('specified router is not implemented!');
            }
            return new Promise(function (resolve) {
                resolve(_this[_options.method](_options));
            });
        };
        return new Promise(function (resolve, reject) {
            var promise = new Promise(function (_resolve) {
                _resolve(routing(options));
            });
            promise.then(function (result) {
                resolve(result);
            }).catch(function (err) { return reject(err); });
        });
    };
    Sync.prototype.removeSync = function (request) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.removeSyncEntry(_this.$options));
        });
    };
    return Sync;
}());
exports.Sync = Sync;


/***/ }),
/* 52 */
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
var logger_1 = __webpack_require__(1);
/**
 * Persistence handler to triggers events when XHR Request ID finished! The interesting part here is that
 * the events are created anonym for the client using the this API.
 * @ignore
 * NOTE: Support IE9+
 * @type {{addListener, removeListener, getListener, dispatchEvent, removeAllListeners, getAllEvents, runClearDeamon, toString}}
 */
var Handler = /** @class */ (function () {
    function Handler() {
        this.i = 0;
        this.listeners = {};
        this.ttl = 30000; //30sec //1000 * 60; // all in ms
        this.ttlInterval = 100 * 60 * 20; // in ms - each 2mins
        this.daemon = null;
        this.logger = new logger_1.Logger('Handler');
    }
    /**
     * Add internal anonym listener
     *
     * @param event
     * @param handler
     * @param capture
     * @returns {*}
     */
    Handler.prototype.addListener = function (event, handler, capture) {
        this.cleanEventsJob();
        if (event == null) {
            throw new Error('event name cannot be null or undefined');
        }
        if (handler == null || typeof handler !== 'function') {
            throw new Error('event handler cannot be null or undefined function');
        }
        var element = window;
        if (capture != null || typeof capture === 'boolean') {
            element.addEventListener(event, handler, capture);
        }
        else {
            element.addEventListener(event, handler);
        }
        this.listeners[event] = {
            event: event,
            element: element,
            handler: handler,
            capture: capture,
            timestamp: new Date().getTime(),
        };
        return this.listeners[event];
    };
    Handler.prototype.removeInternListener = function (name) {
        if (name != null) {
            if (this.listeners.hasOwnProperty(name)) {
                this.listeners[name].element.removeEventListener(this.listeners[name].event, this.listeners[name].handler, this.listeners[name].capture);
                delete this.listeners[name];
            }
        }
    };
    Handler.prototype.removeAllListeners = function () {
        for (var name_1 in this.listeners) {
            if (this.listeners.hasOwnProperty(name_1)) {
                if (typeof this.listeners[name_1] === 'object') {
                    this.listeners[name_1].element.removeEventListener(this.listeners[name_1].event, this.listeners[name_1].handler, this.listeners[name_1].capture);
                    delete this.listeners[name_1];
                }
            }
        }
    };
    Handler.prototype.showAll = function () {
        for (var name_2 in this.listeners) {
            if (this.listeners.hasOwnProperty(name_2)) {
                this.logger.debug('showAll', 'event details: ', this.listeners[name_2]);
            }
        }
    };
    Handler.prototype.getInternAllEvents = function () {
        return this.listeners;
    };
    Handler.prototype.getInternListener = function (name) {
        if (this.listeners.hasOwnProperty(name)) {
            if (typeof this.listeners[name] === 'object') {
                return this.listeners[name];
            }
        }
    };
    /**
     * Dispatch custom event, if registered and remove it from the listeners! IE9+
     *
     * Reference: http://stackoverflow.com/questions/5660131/how-to-removeeventlistener-that-is-addeventlistener-with-anonymous-function
     *
     * @param status - http status code, like 200,300 so on
     * @param statusText - the http status text, like 'OK'
     * @param payload - the payload
     * @param requestID - internal request id
     */
    Handler.prototype.dispatchInternEvent = function (status, statusText, payload, requestID) {
        var _this = this;
        if (!window['CustomEvent']) {
            return;
        }
        if (!this.listeners.hasOwnProperty(requestID) && typeof this.listeners[requestID] === 'object') {
            return;
        }
        var anonymEvent = new CustomEvent(requestID, {
            detail: {
                status: status,
                statusText: statusText,
                data: payload,
                requestid: requestID,
                time: new Date().getTime(),
            },
            bubbles: true,
            cancelable: true,
        });
        setTimeout(function () {
            try {
                var cancelled = window.dispatchEvent(anonymEvent);
            }
            catch (e) {
                _this.logger.error(e);
            }
            finally {
                setTimeout(function () {
                    _this.removeInternListener(requestID);
                }, 0);
            }
        }, 0);
    };
    /**
     * Periodically remove unused events after specified TTL (Time to Leave)!
     */
    Handler.prototype.cleanEventsJob = function () {
        var age = this.ttl;
        var now = Date.now();
        var registeredEvents = this.getInternAllEvents();
        for (var eventName in registeredEvents) {
            if (registeredEvents.hasOwnProperty(eventName)) {
                var diff = now - this.listeners[eventName].timestamp;
                if (age < diff) {
                    this.removeInternListener(eventName);
                }
            }
        }
    };
    /**
     * This will set and start the demo, or stop if if age < 0
     *
     * @param age - the max leave age, or if 0 stop the deamon
     * @param interval - the interval on which to run the deamon
     */
    Handler.prototype.setTTL = function (age, interval) {
        if (age < 0) {
            if (this.daemon != null) {
                clearInterval(this.daemon);
            }
        }
        else if (age == 0) {
            this.cleanEventsJob();
        }
        else {
            this.ttl = age || this.ttl;
            this.ttlInterval = interval || this.ttlInterval;
            this.daemon = setInterval(this.cleanEventsJob, this.ttlInterval);
        }
    };
    return Handler;
}());
exports.Handler = Handler;
/**
 * Usage example:
 *
 *

 Persistence.Events.$on('success', function(args) {
    console.log('on success event emited', args);
  });

 Persistence.Events.$on('error', function(args) {
    console.log('on error event emited', args);
  });

 Persistence.Events.$on('timeout', function(args) {
    console.log('on timeout event emitted', args);
  });

 Persistence.Events.$on('timeout', function(args) {
    console.log('on timeout event emitted again', args);
  });

 setTimeout(function(){
    Persistence.Events.$emit('success', {name: 'Lyudmil'});
    Persistence.Events.$emit('error', {status: 500, error: 'this is error message'});
    Persistence.Events.$emit('timeout', {msg: 'this is timeout error'});

    Persistence.Events.$flush('success');
    Persistence.Events.$emit('success', {name: 'Lyudmil'});
  },3000);

 * @ignore
 * @type {{}}
 */
var Events = /** @class */ (function () {
    function Events() {
        this.observers = {
            success: [],
            error: [],
            timeout: [],
        };
    }
    Events.prototype.$on = function (name, observer) {
        if (name !== null && typeof name === 'string') {
            if (this.observers.hasOwnProperty(name)) {
                if (typeof observer === 'function') {
                    this.observers[name].push(observer);
                }
            }
        }
    };
    Events.prototype.$emit = function (name, obj) {
        if (name !== null && typeof name === 'string') {
            if (this.observers.hasOwnProperty(name)) {
                if (obj !== null) {
                    for (var i = 0; i < this.observers[name].length; i++) {
                        this.observers[name][i](obj);
                    }
                }
            }
        }
    };
    Events.prototype.$flush = function (name) {
        if (name !== null && typeof name === 'string') {
            if (this.observers.hasOwnProperty(name)) {
                for (var i = this.observers[name].length - 1; i >= 0; i--) {
                    this.observers[name].splice(0, 1);
                }
            }
        }
    };
    Events.prototype.$show = function (name) {
        throw new Error('not implemented');
    };
    return Events;
}());
exports.Events = Events;
/**
 * Global event emitter handler, usually used only for internal modules process work!
 * NOTE: This class is equal to singleton it will exist only once!
 * @ignore
 */
var EventsEmitter = /** @class */ (function () {
    function EventsEmitter() {
        /**
         * Events property is a hashmap, with each property being an array of callbacks!
         * @type {{}}
         */
        this.events = {};
        /**
         * boolean determines whether or not the callbacks associated with each event should be
         * proceeded async, default is false!
         *
         * @type {boolean}
         */
        this.asyncListeners = false;
    }
    /**
     * Adds a listener to the queue of callbacks associated to an event
     *
     * @param eventName - the name of the event to associate
     * @param listener - the actual implementation
     * @returns {*} - returns the ID of the lister to be use to remove it later
     */
    EventsEmitter.prototype.on = function (eventName, listener) {
        var event = this.events[eventName];
        if (!event) {
            event = this.events[eventName] = [];
        }
        event.push(listener);
        return listener;
    };
    /**
     * Fires event if specific event was registered, with the option of passing parameters which are going to be processed by the callback
     * (i.e. if passing emit(event, arg0, arg1) the listener should take two parameters)
     *
     * @param eventName
     * @param data - optional object passed to the event!
     */
    EventsEmitter.prototype.emit = function (eventName, data) {
        var _this = this;
        if (eventName && this.events[eventName]) {
            this.events[eventName].forEach(function (listener) {
                if (_this.asyncListeners) {
                    setTimeout(function () { return listener(data); }, 1);
                }
                else {
                    listener(data);
                }
            });
        }
        else {
            throw new Error('No event ' + eventName + ' defined');
        }
    };
    /**
     * Remove listeners
     *
     * @param eventName
     * @param listener
     */
    EventsEmitter.prototype.removeListener = function (eventName, listener) {
        if (this.events[eventName]) {
            var listeners = this.events[eventName];
            listeners.splice(listeners.indexOf(listener), 1);
        }
    };
    return EventsEmitter;
}());
exports.EventsEmitter = EventsEmitter;
/**
 * Global event emitter for all persistence class, it can be inherited only via NEW, which will make
 * sure that specific instance exist only for the module initiating it!
 * @ignore
 * @constructor
 */
var PersistenceEventEmitter = /** @class */ (function (_super) {
    __extends(PersistenceEventEmitter, _super);
    function PersistenceEventEmitter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Stores all registered listeners! It could be overridden if the object prototype this class!
         * @type {{}}
         */
        _this.events = {};
        /**
         * If listener should be executed async, default false
         */
        _this.asyncListeners = false;
        return _this;
    }
    return PersistenceEventEmitter;
}(EventsEmitter));
exports.PersistenceEventEmitter = PersistenceEventEmitter;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*
* @authors Lyudmil Pelov
*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper module with most common used functions from 3rd party frameworks!
 * @ignore
 * @type {{isEmpty, isArray, isFunction, isObject, isNull, extendOwn, extend}}
 */
var Common = /** @class */ (function () {
    function Common() {
        this.ArrayProto = Array.prototype;
        this.ObjProto = Object.prototype;
        this.FuncProto = Function.prototype;
        this.push = this.ArrayProto.push;
        this.slice = this.ArrayProto.slice;
        this.toString = this.ObjProto.toString;
        this.hasOwnProperty = this.ObjProto.hasOwnProperty;
        this.nativeIsArray = Array.isArray;
        this.nativeKeys = Object.keys;
        this.nativeBind = this.FuncProto.bind;
        this.nativeCreate = Object.create;
        this.extendOwn = this.extender(false);
        this.extend = this.extender(true);
        /**
         * Polyfill in case we want to support browser IE8 and lower, all IE9+ browsers support this
         * out of box already
         */
        if (!Array['isArray']) {
            Array['isArray'] = (function (arg) { return Object.prototype.toString.call(arg) === '[object Array]'; });
        }
        if (!Array.prototype.findIndex) {
            Array.prototype.findIndex = function (predicate) {
                if (this === null) {
                    throw new TypeError('Array.prototype.findIndex called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;
                for (var i = 0; i < length; i++) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return i;
                    }
                }
                return -1;
            }.bind(this);
        }
        if (!Array.prototype.filter) {
            Array.prototype.filter = function (fun) {
                'use strict';
                if (this === void 0 || this === null) {
                    throw new TypeError();
                }
                var t = Object(this);
                var len = t.length >>> 0;
                if (typeof fun !== 'function') {
                    throw new TypeError();
                }
                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];
                        if (fun.call(thisArg, val, i, t)) {
                            res.push(val);
                        }
                    }
                }
                return res;
            }.bind(this);
        }
    }
    /**
     * Checks given object type. This implementation is faster than using JS typeof().
     *
     * Support: IE8+
     * @param obj - could be number, string, function, boolean, null and so on
     * @returns {string} - string representative of the object type
     * http://youmightnotneedjquery.com/
     */
    Common.prototype.type = function (obj) {
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    };
    /**
     * Checks if string starts with specific prefix!
     *
     * @param string
     * @param prefix
     * @returns {boolean} - returns also false when provided variable is not string!
     */
    Common.prototype.stringStartsWith = function (string, prefix) {
        if (this.type(string) !== 'string')
            return false;
        return string.slice(0, prefix.length) === prefix;
    };
    /**
     * Checks if string ends with specific prefix!
     *
     * @param string
     * @param suffix
     * @returns {boolean} - false also when the provided variable is not string!
     */
    Common.prototype.stringEndsWith = function (string, suffix) {
        if (this.type(string) !== 'string')
            return false;
        return suffix === '' || string.slice(-suffix.length) === suffix;
    };
    /**
     * Clones given JS object using the JSON stringify method to create new reference.
     *
     * @param obj
     * @returns {*}
     */
    Common.prototype.clone = function (obj) {
        obj = obj || {};
        var cloneObjects = true;
        return cloneObjects ? JSON.parse(JSON.stringify(obj)) : obj;
    };
    Common.prototype.cleanObjects = function (objects) {
        var result = [];
        for (var idx in objects) {
            if (objects.hasOwnProperty(idx)) {
                var object = this.cleanObject(objects[idx]);
                result.push(object);
            }
        }
        return result;
    };
    Common.prototype.cleanObject = function (object) {
        var cloned = this.clone(object);
        delete cloned['$loki'];
        delete cloned['meta'];
        return cloned;
    };
    Common.prototype.getUID = function () {
        return Math.floor(Math.random() * 0x100000000) + '';
    };
    Common.prototype.isTypeOf = function (name, obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
    Common.prototype.isDate = function (value) {
        return this.isTypeOf('Date', value);
    };
    Common.prototype.isString = function (value) {
        return this.isTypeOf('String', value);
    };
    Common.prototype.isUndefined = function (value) {
        return value === void 0;
    };
    Common.prototype.has = function (obj, key) {
        return obj != null && this.hasOwnProperty.call(obj, key);
    };
    Common.prototype.isFinite = function (value) {
        return isFinite(value) && !isNaN(parseFloat(value));
    };
    Common.prototype.isNaN = function (value) {
        return this.isNumber(value) && value !== +value;
    };
    Common.prototype.isBoolean = function (value) {
        return value === true || value === false || toString.call(value) === '[object Boolean]';
    };
    Common.prototype.isEmpty = function (value) {
        if (value === null) {
            return true;
        }
        if (this.isArrayLike(value)
            && (this.isArray(value)
                || typeof value === 'string' // is string
                || this.isFunction(value.splice) // is array
                || this.isFunction(value.callee))) {
            return !value.length;
        }
        if (!!value && typeof value == 'object') {
            var str = value.toString();
            if (str == '[object Map]' || str == '[object Set]') {
                return !value.size;
            }
        }
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                return false;
            }
        }
        if (!!value && this.isNumber(value)) {
            return false;
        }
        return true;
    };
    Common.prototype.isArrayLike = function (value) {
        return value
            && typeof value === 'object'
            && typeof value.length === 'number'
            && value.length >= 0
            && value.length % 1 === 0;
    };
    Common.prototype.isArray = function (value) {
        return Array.isArray(value);
    };
    Common.prototype.isFunction = function (value) {
        return typeof value === 'function' || false;
    };
    Common.prototype.isObject = function (value) {
        var type = typeof value;
        return type === 'function' || type === 'object' && !!value;
    };
    Common.prototype.isNull = function (value) {
        return value === null;
    };
    Common.prototype.isNumber = function (value) {
        if (typeof value == 'number') {
            return true;
        }
        return value.toString() == '[object Number]';
    };
    /**
     * Copy the properties from one object to another, however this function does NOT have the deep copy
     * capabilities.
     *
     * @param allKeys
     * @returns {Function}
     */
    Common.prototype.extender = function (allKeys) {
        return function (object) {
            var argLength = arguments.length;
            if (object == null || argLength < 2) {
                return object;
            }
            for (var argIndex = 1; argIndex < argLength; argIndex++) {
                var source = arguments[argIndex];
                if (source && this.isObject(source)) {
                    for (var key in source) {
                        if (allKeys || source.hasOwnProperty(key)) {
                            object[key] = source[key];
                        }
                    }
                }
            }
            return object;
        };
    };
    Common.prototype.identity = function (value) {
        return value;
    };
    /**
     * Deep extend capabilities taken from the JQuery implementation!
     * @returns {*|{}}
     */
    Common.prototype.deepExtend = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, push = Array.prototype.push, slice = Array.prototype.slice, trim = String.prototype.trim, indexOf = Array.prototype.indexOf, class2type = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regexp',
            '[object Object]': 'object',
        }, jQuery = {
            isFunction: function (obj) { return jQuery.type(obj) === 'function'; },
            isArray: Array.isArray || (function (obj) { return jQuery.type(obj) === 'array'; }),
            isWindow: function (obj) { return obj != null && obj == obj.window; },
            isNumeric: function (obj) { return !isNaN(parseFloat(obj)) && isFinite(obj); },
            type: function (obj) { return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object'; },
            isPlainObject: function (obj) {
                if (!obj || jQuery.type(obj) !== 'object' || obj.nodeType) {
                    return false;
                }
                try {
                    if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                        return false;
                    }
                }
                catch (e) {
                    return false;
                }
                var key;
                for (key in obj) {
                }
                return key === undefined || hasOwn.call(obj, key);
            },
        };
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== 'object' && !jQuery.isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (i; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        }
                        else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = this.deepExtend(deep, clone, copy);
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    return Common;
}());
exports.Common = Common;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2015, Oracle and/or its affiliates. All rights reserved.
* Created by Lyudmil Pelov on 27/04/16.
*
* @author Lyudmil Pelov
*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Intercepts the XMLHTTPRequest
 * @type {{run, runWithoutReadInBackground, listener, registerRequestCompletedCallback}}
 * @ignore
 */
var Process = /** @class */ (function () {
    function Process($options, $common, $handler) {
        this.$options = $options;
        this.$common = $common;
        this.$handler = $handler;
    }
    Process.prototype.run = function (callback) {
        this.$options.oneOn();
        callback();
    };
    Process.prototype.runWithoutReadInBackground = function (callback) {
        this.$options.dbFirstFalseForNextCall();
        callback();
    };
    Process.prototype.listener = function (requestID, callback) {
        if (typeof this.$handler !== 'undefined' && requestID)
            this.$handler.addListener(requestID, function (e) {
                callback(e.detail);
            }, false);
    };
    Process.prototype.registerRequestCompletedCallback = function (obj, callback) {
        if (typeof this.$handler !== 'undefined' && obj !== null)
            if (this.$common.isNumber(obj)) {
                this.$handler.addListener(obj, function (e) {
                    callback(e.detail.data, e.detail.status, e.detail.statusText, e.detail.requestid, e.detail.time);
                }, false);
            }
            else if (this.$common.isObject(obj)) {
                if (obj.hasOwnProperty(Process.REQUEST_ID)) {
                    this.$handler.addListener(obj[Process.REQUEST_ID], function (e) {
                        callback(e.detail.data, e.detail.status, e.detail.statusText, e.detail.requestid, e.detail.time);
                    }, false);
                }
                else if (typeof obj.getResponseHeader === 'function') {
                    if (obj.getResponseHeader(Process.REQUEST_ID) != null) {
                        this.$handler.addListener(obj.getResponseHeader(Process.REQUEST_ID), function (e) {
                            callback(e.detail.data, e.detail.status, e.detail.statusText, e.detail.requestid, e.detail.time);
                        }, false);
                    }
                }
            }
    };
    Process.REQUEST_ID = 'Request-ID';
    return Process;
}());
exports.Process = Process;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function parseURI (str, opts) {
  opts = opts || {}

  var o = {
    key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
    q: {
      name: 'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  }

  var m = o.parser[opts.strictMode ? 'strict' : 'loose'].exec(str)
  var uri = {}
  var i = 14

  while (i--) uri[o.key[i]] = m[i] || ''

  uri[o.q.name] = {}
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2
  })

  return uri
}


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * Default configs.
 */
var DEFAULT_DELIMITER = '/'
var DEFAULT_DELIMITERS = './'

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  '(\\\\.)',
  '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER
  var delimiters = (options && options.delimiters) || DEFAULT_DELIMITERS
  var pathEscaped = false
  var res

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length
    if (escaped) {
      path += escaped[1]
      pathEscaped = true
      continue
    }

    var prev = ''
    var next = str[index]
    var name = res[2]
    var capture = res[3]
    var group = res[4]
    var modifier = res[5]

    if (!pathEscaped && path.length) {
      var k = path.length - 1

      if (delimiters.indexOf(path[k]) > -1) {
        prev = path[k]
        path = path.slice(0, k)
      }
    }
    if (path) {
      tokens.push(path)
      path = ''
      pathEscaped = false
    }

    var partial = prev !== '' && next !== undefined && next !== prev
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = prev || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prev,
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
    })
  }
  if (path || index < str.length) {
    tokens.push(path + str.substr(index))
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  var matches = new Array(tokens.length)
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (data, options) {
    var path = ''
    var encode = (options && options.encode) || encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token
        continue
      }

      var value = data ? data[token.name] : undefined
      var segment

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
        }

        if (value.length === 0) {
          if (token.optional) continue

          throw new TypeError('Expected "' + token.name + '" to not be empty')
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j], token)

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        segment = encode(String(value), token)

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
        }

        path += token.prefix + segment
        continue
      }

      if (token.optional) {
        if (token.partial) path += token.prefix

        continue
      }

      throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  if (!keys) return path
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        pattern: null
      })
    }
  }

  return path
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER)
  var delimiters = options.delimiters || DEFAULT_DELIMITERS
  var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|')
  var route = ''
  var isEndDelimited = tokens.length === 0
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
      isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.repeat
        ? '(?:' + token.pattern + ')(?:' + prefix + '(?:' + token.pattern + '))*'
        : token.pattern

      if (keys) keys.push(token)

      if (token.optional) {
        if (token.partial) {
          route += prefix + '(' + capture + ')?'
        } else {
          route += '(?:' + prefix + '(' + capture + '))?'
        }
      } else {
        route += prefix + '(' + capture + ')'
      }
    }
  }

  if (end) {
    if (!strict) route += '(?:' + delimiter + ')?'

    route += endsWith === '$' ? '$' : '(?=' + endsWith + ')'
  } else {
    if (!strict) route += '(?:' + delimiter + '(?=' + endsWith + '))?'
    if (!isEndDelimited) route += '(?=' + delimiter + '|' + endsWith + ')'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys)
  }

  if (Array.isArray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
  }

  return stringToRegexp(/** @type {string} */ (path), keys, options)
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(1);
var pathToRegexp = __webpack_require__(56);
var parseUri = __webpack_require__(55);
/**
 * Module contains all public settings for the persistence library
 * revealing module with getter and setters!
 * @ignore
 */
var Options = /** @class */ (function () {
    function Options($common) {
        this.$common = $common;
        this.$db = null;
        this.dbFirst = true;
        this._isCordova = typeof window['cordova'] !== 'undefined';
        this.timeout = 30000; // 30s,
        this.syncTimeout = 30000; // 30s
        this.isPersistUri = {};
        this.persistUri = [];
        this.isPersistUrlCache = {};
        this.parseUrlCache = {};
        this.on = null;
        this.passOne = false;
        this.alwayson = true;
        this.alwaysoff = false;
        this.dbFirstFalseForNextCallBool = false;
        this.maxsyncattempts = 0; // by default unlimited
        this.autoremoveafterreachmaxattemps = false;
        this.autoSync = false;
        this.offlinedbname = 'offline';
        this.synclogdbname = 'synclog';
        this.dbprefix = 'persist';
        this.isTest = false;
        this.logger = new logger_1.Logger('Options');
        /**
         * If not set the default is: PERIODIC_REFRESH_POLICY_REFRESH_NONE
         *
         * NOTE: http://docs.oracle.com/cloud/latest/mobilecs_gs/MCSUA/GUID-7C2A0D49-F898-4886-9A6A-4FF799F776F4.htm#MCSUA711
         */
        this.periodicRefreshPolicy = {
            PERIODIC_REFRESH_POLICY_REFRESH_NONE: 'PERIODIC_REFRESH_POLICY_REFRESH_NONE',
            PERIODIC_REFRESH_POLICY_REFRESH_EXPIRED_ITEM_ON_STARTUP: 'PERIODIC_REFRESH_POLICY_REFRESH_EXPIRED_ITEM_ON_STARTUP',
            PERIODIC_REFRESH_POLICY_PERIODICALLY_REFRESH_EXPIRED_ITEMS: 'PERIODIC_REFRESH_POLICY_PERIODICALLY_REFRESH_EXPIRED_ITEMS',
        };
        this.fetchPolicy = {
            FETCH_FROM_CACHE: 'FETCH_FROM_CACHE',
            FETCH_FROM_SERVICE: 'FETCH_FROM_SERVICE',
            FETCH_FROM_SERVICE_IF_ONLINE: 'FETCH_FROM_SERVICE_IF_ONLINE',
            FETCH_FROM_SERVICE_ON_CACHE_MISS: 'FETCH_FROM_SERVICE_ON_CACHE_MISS',
            FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY: 'FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY',
            FETCH_FROM_CACHE_SCHEDULE_REFRESH: 'FETCH_FROM_CACHE_SCHEDULE_REFRESH',
            FETCH_WITH_REFRESH: 'FETCH_WITH_REFRESH',
        };
        this.expirationPolicy = {
            EXPIRE_ON_RESTART: 'EXPIRE_ON_RESTART',
            EXPIRE_AFTER: 'EXPIRE_AFTER',
            NEVER_EXPIRE: 'NEVER_EXPIRE',
        };
        this.evictionPolicy = {
            EVICT_ON_EXPIRY_AT_STARTUP: 'EVICT_ON_EXPIRY_AT_STARTUP',
            MANUAL_EVICTION: 'MANUAL_EVICTION',
        };
        this.updatePolicy = {
            UPDATE_IF_ONLINE: 'UPDATE_IF_ONLINE',
            QUEUE_IF_OFFLINE: 'QUEUE_IF_OFFLINE',
        };
        this.conflictPolicy = {
            CLIENT_WINS: 'CLIENT_WINS',
            PRESERVE_CONFLICT: 'PRESERVE_CONFLICT',
            SERVER_WINS: 'SERVER_WINS',
        };
        this.clientPolicies = {
            periodicRefreshPolicy: this.periodicRefreshPolicy.PERIODIC_REFRESH_POLICY_REFRESH_NONE,
            periodicRefreshInterval: 120,
            policies: [],
        };
        /**
         * Specify the default clientPolicies!
         *
         * @type {{periodicRefreshPolicy: string}}
         */
        this.defaultPolicy = {
            periodicRefreshPolicy: this.periodicRefreshPolicy.PERIODIC_REFRESH_POLICY_REFRESH_NONE,
            conflictResolutionPolicy: this.conflictPolicy.PRESERVE_CONFLICT,
            evictionPolicy: this.evictionPolicy.MANUAL_EVICTION,
            expirationPolicy: this.expirationPolicy.EXPIRE_ON_RESTART,
            expireAfter: Number.MAX_VALUE,
            fetchPolicy: this.fetchPolicy.FETCH_FROM_SERVICE_IF_ONLINE,
            noCache: false,
            updatePolicy: this.updatePolicy.UPDATE_IF_ONLINE,
        };
        this.clientPolicies['default'] = this.defaultPolicy;
    }
    Object.defineProperty(Options.prototype, "syncTimeOut", {
        get: function () {
            return this.syncTimeout;
        },
        set: function (ms) {
            if (typeof ms === 'number') {
                this.syncTimeout = ms || this.syncTimeout;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "persistUris", {
        get: function () {
            return this.persistUri;
        },
        set: function (arr) {
            this.parsePathConfig(arr);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "onTimeOut", {
        set: function (callback) {
            if (typeof callback === 'function') {
                this.ontimeout = callback;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "onError", {
        set: function (callback) {
            if (typeof callback === 'function') {
                this.onerror = callback;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "onSuccess", {
        set: function (callback) {
            if (typeof callback === 'function') {
                this.onsuccess = callback;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "isonline", {
        set: function (callback) {
            if (typeof callback === 'function') {
                this.isOnline = callback;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "alwaysOn", {
        set: function (bool) {
            this.alwayson = !!bool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "off", {
        get: function () {
            return this.alwaysoff;
        },
        set: function (bool) {
            typeof bool === 'boolean' ? this.alwaysoff = bool : this.alwaysoff = false;
        },
        enumerable: true,
        configurable: true
    });
    Options.prototype.switchOff = function (bool) {
        if (bool === void 0) { bool = true; }
        typeof bool === 'boolean' ? this.alwaysoff = bool : this.alwaysoff = false;
    };
    Object.defineProperty(Options.prototype, "maxSyncAttempts", {
        get: function () {
            return this.maxsyncattempts;
        },
        set: function (attempts) {
            this.setMaxSyncAttempts(attempts);
        },
        enumerable: true,
        configurable: true
    });
    Options.prototype.setMaxSyncAttempts = function (attempts) {
        if (typeof attempts === 'number') {
            this.maxsyncattempts = attempts || this.maxsyncattempts;
        }
    };
    Object.defineProperty(Options.prototype, "autoRemoveAfterReachMaxAttemps", {
        get: function () {
            return this.autoremoveafterreachmaxattemps;
        },
        set: function (bool) {
            this.setAutoRemoveAfterReachMaxAttempts(bool);
        },
        enumerable: true,
        configurable: true
    });
    Options.prototype.setAutoRemoveAfterReachMaxAttempts = function (bool) {
        if (typeof bool === 'boolean') {
            this.autoremoveafterreachmaxattemps = bool || this.autoremoveafterreachmaxattemps;
        }
    };
    Options.prototype.ondbprefixchange = function (oldVal, newVal) {
        this.dbprefixchangehandler(oldVal, newVal);
    };
    Object.defineProperty(Options.prototype, "onDbPrefixChange", {
        set: function (callback) {
            if (typeof callback === 'function') {
                this.ondbprefixchange = callback;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "dbPrefix", {
        get: function () {
            return this.dbprefix;
        },
        set: function (prefix) {
            if (typeof prefix === 'string') {
                var old = this.dbprefix;
                this.dbprefix = prefix;
                this.ondbprefixchange(old, this.dbprefix);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "offlineDBName", {
        get: function () {
            return this.offlinedbname;
        },
        set: function (name) {
            if (typeof name === 'string') {
                this.offlinedbname = name;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "module", {
        get: function () {
            return this._module;
        },
        set: function (implementation) {
            this.setModule(implementation);
        },
        enumerable: true,
        configurable: true
    });
    Options.prototype.setModule = function (implementation) {
        if (!implementation)
            throw new Error('provide module implementation');
        this._module = implementation;
    };
    Object.defineProperty(Options.prototype, "Module", {
        /**
         * @deprecated replace with lowercase
         */
        get: function () {
            return this._module;
        },
        /**
         * @deprecated replace with lowercase
         */
        set: function (implementation) {
            if (!implementation)
                throw new Error('provide module implementation');
            this._module = implementation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "syncLogDBName", {
        get: function () {
            return this.synclogdbname;
        },
        set: function (name) {
            if (typeof name === 'string') {
                this.synclogdbname = name;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "Policies", {
        get: function () {
            return this.clientPolicies;
        },
        set: function (policies) {
            this.setPolicies(policies);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "DefaultPolicies", {
        get: function () {
            return this.defaultPolicy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "isCordova", {
        get: function () {
            return this._isCordova;
        },
        enumerable: true,
        configurable: true
    });
    Options.prototype.dbprefixchangehandler = function (oldval, newval) {
        this.logger.debug(' changed from ' + oldval + ' to ' + newval);
        return newval;
    };
    /**
     * Set sync library config clientPolicies
     * @param config
     */
    Options.prototype.setPolicies = function (config) {
        if (!config) {
            this.logger.error('config cannot be empty object');
            throw new Error('config cannot be empty object');
        }
        if (!this.$common.isObject(config)) {
            this.logger.error('policy is not object');
            throw new Error('policy is not object');
        }
        var found = false;
        var name;
        for (name in config) {
            if (config.hasOwnProperty(name)) {
                found = true;
                break;
            }
        }
        if (!found) {
            this.logger.error('policy object does not contain any properties!');
            throw new Error('policy object does not contain any properties!');
        }
        this.setDefaultPolicies(config);
        this.setUrlPolicies(config);
    };
    /**
     * Replace the default policy config with the new one, if any
     * @param config
     */
    Options.prototype.setDefaultPolicies = function (config) {
        if (!config.hasOwnProperty('default')) {
            return;
        }
        this.logger.debug('apply new default policies');
        if (config.default.conflictResolutionPolicy in this.conflictPolicy) {
            this.defaultPolicy.conflictResolutionPolicy = config.default.conflictResolutionPolicy ||
                this.conflictPolicy.PRESERVE_CONFLICT;
        }
        if (config.default.evictionPolicy in this.evictionPolicy) {
            this.defaultPolicy.evictionPolicy = config.default.evictionPolicy || this.evictionPolicy.MANUAL_EVICTION;
        }
        if (config.default.expirationPolicy in this.expirationPolicy) {
            this.defaultPolicy.expirationPolicy = config.default.expirationPolicy || this.expirationPolicy.EXPIRE_ON_RESTART;
        }
        if (typeof config.default.expireAfter === 'number') {
            this.defaultPolicy.expireAfter = config.default.expireAfter || Number.MAX_VALUE;
        }
        if (config.default.fetchPolicy in this.fetchPolicy) {
            this.defaultPolicy.fetchPolicy = config.default.fetchPolicy || this.fetchPolicy.FETCH_FROM_SERVICE_IF_ONLINE;
        }
        if (typeof config.default.noCache === 'boolean') {
            this.defaultPolicy.noCache = config.default.noCache || false;
        }
        if (config.default.updatePolicy in this.updatePolicy) {
            this.defaultPolicy.updatePolicy = config.default.updatePolicy || this.updatePolicy.UPDATE_IF_ONLINE;
        }
    };
    Options.prototype.setUrlPolicies = function (config) {
        if (config.hasOwnProperty('periodicRefreshPolicy') &&
            this.periodicRefreshPolicy.hasOwnProperty(config.periodicRefreshPolicy)) {
            this.clientPolicies.periodicRefreshPolicy = config.periodicRefreshPolicy ||
                this.periodicRefreshPolicy.PERIODIC_REFRESH_POLICY_REFRESH_NONE;
        }
        if (config.hasOwnProperty('periodicRefreshInterval') && typeof config.periodicRefreshInterval === 'number') {
            this.clientPolicies.periodicRefreshInterval = config.periodicRefreshInterval || 1000 * 120; // 2 mins
        }
        if (!config.hasOwnProperty('policies')) {
            this.logger.error('synchronisation configuration requires path policies');
            throw new Error('synchronisation configuration requires path policies');
        }
        this.parsePathConfig(config.policies);
    };
    Options.prototype.setPolicyForURL = function (urlPolicyObject) {
        var urlPolicies = JSON.parse(JSON.stringify(this.defaultPolicy));
        if ('conflictResolutionPolicy' in urlPolicyObject &&
            urlPolicyObject.conflictResolutionPolicy in this.conflictPolicy) {
            urlPolicies.conflictResolutionPolicy = urlPolicyObject.conflictResolutionPolicy ||
                this.conflictPolicy.PRESERVE_CONFLICT;
        }
        if ('evictionPolicy' in urlPolicyObject && urlPolicyObject.evictionPolicy in this.evictionPolicy) {
            urlPolicies.evictionPolicy = urlPolicyObject.evictionPolicy || this.evictionPolicy.MANUAL_EVICTION;
        }
        if ('expirationPolicy' in urlPolicyObject && urlPolicyObject.expirationPolicy in this.expirationPolicy) {
            urlPolicies.expirationPolicy = urlPolicyObject.expirationPolicy || this.expirationPolicy.EXPIRE_ON_RESTART;
        }
        if ('expireAfter' in urlPolicyObject && typeof urlPolicyObject.expireAfter === 'number') {
            urlPolicies.expireAfter = urlPolicyObject.expireAfter || Number.MAX_VALUE;
        }
        if ('fetchPolicy' in urlPolicyObject && urlPolicyObject.fetchPolicy in this.fetchPolicy) {
            urlPolicies.fetchPolicy = urlPolicyObject.fetchPolicy || this.fetchPolicy.FETCH_FROM_SERVICE_IF_ONLINE;
        }
        if ('noCache' in urlPolicyObject && typeof urlPolicyObject.noCache === 'boolean') {
            urlPolicies.noCache = urlPolicyObject.noCache || false;
        }
        if ('updatePolicy' in urlPolicyObject && urlPolicyObject.updatePolicy in this.updatePolicy) {
            urlPolicies.updatePolicy = urlPolicyObject.updatePolicy || this.updatePolicy.UPDATE_IF_ONLINE;
        }
        return urlPolicies;
    };
    /**
     * go throw the path config settings and set it up
     * @param arrOfPaths
     */
    Options.prototype.parsePathConfig = function (arrOfPaths) {
        if (!Array.isArray(arrOfPaths)) {
            this.logger.error('Persistence.Options.persistUris', 'param should be array!');
            throw new Error('Persistence.Options.persistUris');
        }
        var route = this.pathMatch({
            sensitive: true,
            strict: false,
            end: true,
        });
        var persistRegUriArr = [];
        this.clientPolicies['policies'] = arrOfPaths;
        if (arrOfPaths != null && Array.isArray(arrOfPaths)) {
            var len = arrOfPaths.length;
            var i = 0;
            for (; i < len; i++) {
                var tmpPersistURL = {};
                if (arrOfPaths[i].hasOwnProperty('path')) {
                    tmpPersistURL.uri = arrOfPaths[i].path;
                    tmpPersistURL.reg = pathToRegexp(tmpPersistURL.uri, [], { sensitive: true });
                    tmpPersistURL.tokens = pathToRegexp.parse(tmpPersistURL.uri);
                    tmpPersistURL.matchURI = route(tmpPersistURL.uri);
                    tmpPersistURL.policies = this.setPolicyForURL(arrOfPaths[i]);
                    this.clientPolicies['policies'][i] = tmpPersistURL.policies;
                    this.clientPolicies['policies'][i].path = tmpPersistURL.uri;
                    /*
                     * http://stackoverflow.com/questions/983267/access-the-first-property-of-an-object
                     * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
                     *
                     * var params = match('/users/1/emails');
                     * params[Object.keys(params)[0]]; // return the ID
                     */
                    this.persistUri.push(tmpPersistURL);
                    persistRegUriArr.push(tmpPersistURL.uri);
                }
            } // END OF FOR
            this.isPersistUri = pathToRegexp(persistRegUriArr, [], { sensitive: true });
        }
    };
    /**
     * This simple implementation will check if specific path match and URL for persistence and return
     * object with all parameters.
     *
     * @param options
     * @returns {Function}
     * @throws Error - in case decoding of given parameter is not possible
     */
    Options.prototype.pathMatch = function (options) {
        var _this = this;
        options = options || {};
        return function (path) {
            var keys = [];
            var re = pathToRegexp(path, keys, options);
            return function (pathname, params) {
                var m = re.exec(pathname);
                if (!m)
                    return false;
                params = params || [];
                var key;
                var param;
                var obj = {};
                for (var i = 0; i < keys.length; i++) {
                    key = keys[i];
                    param = m[i + 1];
                    if (!param)
                        continue;
                    obj = {
                        name: key.name,
                        value: _this.decodeParam(param),
                    };
                    params.push(obj);
                    if (key.repeat) {
                        params[params.length - 1].name = params[params.length - 1].name.split(key.delimiter);
                    }
                }
                return params;
            };
        };
    };
    /**
     * Decodes parameters from the url
     *
     * @param param
     * @returns {string}
     */
    Options.prototype.decodeParam = function (param) {
        try {
            return decodeURIComponent(param);
        }
        catch (e) {
            throw Error('failed to decode param "' + param + '"');
        }
    };
    /**
     * @deprecated - options table not required anymore!
     * @param options
     * @returns {*}
     */
    Options.prototype.setUrlCache = function (options) {
        if (!this.$common.isObject(options))
            return;
        if (!options.hasOwnProperty('url'))
            return;
        if (!options.hasOwnProperty('mcs'))
            return;
        var persistentPath = this.isPersistentUrl(options.url);
        if (persistentPath === false) {
            throw new Error('Persistence.Options.setUrlCache()-> URI was not configured for persistence:' + options.url);
        }
        options['url'] = persistentPath.root;
        var col = this.$db.getCollectionByName('options');
        var result = col.findOne({ url: persistentPath.root });
        if (result) {
            this.$common.extendOwn(result, options);
            return col.update(result);
        }
        else {
            return col.insert(options);
        }
    };
    /**
     * Checks if URL is configured for persistence and return the parameters
     * @param path - string with the current path to check
     * @returns {*} - object with the properties representing the values of the defined URL parameters
     */
    Options.prototype.isPersistentUrl = function (path) {
        if (typeof path !== 'string') {
            this.logger.warn('isPersistentUrl -> path can be only string');
            return false;
        }
        path = this.parseURL(path).path;
        if (path in this.isPersistUrlCache) {
            return this.isPersistUrlCache[path];
        }
        var len = this.persistUri.length;
        var _loop_1 = function (i) {
            try {
                var params = this_1.persistUri[i].matchURI(path);
                if (params === false) {
                    return "continue";
                }
                var cacheItem_1 = {
                    params: params,
                    path: path,
                    root: this_1.persistUri[i].tokens[0],
                    tokens: this_1.persistUri[i].tokens.slice(1),
                    policies: this_1.persistUri[i].policies,
                    isPolicy: null,
                };
                cacheItem_1.isPolicy = function (policy, value) {
                    if (typeof policy !== 'string')
                        return undefined;
                    if (cacheItem_1.policies &&
                        cacheItem_1.policies.hasOwnProperty(policy)) {
                        return value === undefined ? true : cacheItem_1.policies[policy] === value;
                    }
                    return false;
                };
                return { value: this_1.isPersistUrlCache[path] = cacheItem_1 };
            }
            catch (e) {
                this_1.logger.error(e);
                return { value: this_1.isPersistUrlCache[path] = false };
            }
        };
        var this_1 = this;
        for (var i = 0; i < len; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return this.isPersistUrlCache[path] = false;
    };
    /**
     * @deprecated - options table not required anymore!
     * @param path
     * @returns {*}
     */
    Options.prototype.getUrlCache = function (path) {
        return { mcs: true };
    };
    Options.prototype.parseURL = function (url) {
        if (typeof url !== 'string') {
            this.logger.error('Persistence.Options.parseURL -> path can be only string');
            throw new Error('Persistence.Options.parseURL -> path can be only string');
        }
        if (url in this.parseUrlCache) {
            return this.parseUrlCache[url];
        }
        return this.parseUrlCache[url] = parseUri(url);
    };
    Options.prototype.ontimeout = function (e) {
        this.logger.error('xhr.ontimeout', e);
    };
    Options.prototype.onerror = function (e) {
        this.logger.error('xhr.onerror!', e);
    };
    Options.prototype.onsuccess = function (data, status, headers, requestid) {
        this.logger.debug('xhr.onsuccess', data, status, headers, requestid);
    };
    /**
     * More information can be found here:
     * https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
     *
     * @returns {boolean}
     */
    Options.prototype.isOnline = function () {
        var networkState = (navigator && navigator['connection']) ? navigator['connection'].type : 'NULL';
        if ((networkState === '' || networkState === 'NULL')) {
            if (this._isCordova) {
                return false;
            }
            else {
                return navigator.onLine; // IE9+, Safari/iOS 8.4+
            }
        }
        if (networkState === 'unknown' || networkState === 'none') {
            return false;
        }
        return true;
    };
    Options.prototype.isOn = function () {
        if (this.alwayson && !this.passOne) {
            return true;
        }
        if (this.passOne === true) {
            this.passOne = false;
        }
        if (this.on) {
            this.on = null;
            return true;
        }
        return (!!this.on);
    };
    Options.prototype.oneOn = function () {
        this.on = !this.on;
        return true;
    };
    Options.prototype.oneOff = function () {
        this.passOne = true;
    };
    Options.prototype.dbFirstFalseForNextCall = function () {
        if (this.dbFirst === true) {
            this.dbFirstFalseForNextCallBool = true;
        }
    };
    Options.prototype.isDbFirst = function () {
        if (this.dbFirst === false && this.dbFirstFalseForNextCallBool === false) {
            return false;
        }
        else if (this.dbFirst === true && this.dbFirstFalseForNextCallBool === false) {
            return true;
        }
        else if (this.dbFirst === true && this.dbFirstFalseForNextCallBool === true) {
            this.dbFirstFalseForNextCallBool = false;
            return false;
        }
        else {
            return this.dbFirst;
        }
    };
    Options.prototype.reset = function () {
        this.persistUri = [];
        this.clientPolicies.policies = [];
    };
    return Options;
}());
exports.Options = Options;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(57);
var process_1 = __webpack_require__(54);
var common_1 = __webpack_require__(53);
var handler_1 = __webpack_require__(52);
var logger_1 = __webpack_require__(1);
var sync_1 = __webpack_require__(51);
var generic_request_handler_1 = __webpack_require__(50);
var sync_xml_http_request_1 = __webpack_require__(49);
var oracle_rest_request_handler_1 = __webpack_require__(45);
var mcs_request_handler_1 = __webpack_require__(15);
var types_1 = __webpack_require__(0);
var loki = __webpack_require__(8);
var sync_utils_1 = __webpack_require__(44);
/**
 * MCS module.
 * @global
 * @namespace mcs.sync
 * @private
 * @mcs
 */
var MCSSyncModule = /** @class */ (function () {
    function MCSSyncModule(lokiStorageAdapter, logHTTP) {
        if (lokiStorageAdapter === void 0) { lokiStorageAdapter = null; }
        if (logHTTP === void 0) { logHTTP = true; }
        this.logHTTP = logHTTP;
        this._logger = new logger_1.Logger('MCSSyncModule');
        /**
         * Handler type.
         * @name SYNC_REQUEST_HANDLER_TYPE
         * @enum {string}
         * @memberof mcs.sync
         * @readonly
         * @property {string} Generic
         * @property {string} MCS
         * @property {string} OracleRest
         */
        this.SYNC_REQUEST_HANDLER_TYPE = types_1.SyncRequestHandlerTypes;
        this.common = new common_1.Common();
        this.options = new options_1.Options(this.common);
        this._utils = new sync_utils_1.SyncUtils(this.common, this.options);
        this._handler = new handler_1.Handler();
        this._events = new handler_1.Events();
        this._lokiStorageAdapter = lokiStorageAdapter || this.getLokiStorageAdapter();
        this._sync = new sync_1.Sync(this._events, this.common, this.options, this._utils, this._handler, this._lokiStorageAdapter);
        this.process = new process_1.Process(this.options, this.common, this._handler);
        this.options.module = new mcs_request_handler_1.McsRequestHandler(this.options, this.common, this._utils, this._lokiStorageAdapter);
        this._install();
    }
    MCSSyncModule.prototype.getLokiStorageAdapter = function () {
        if (this.options.isCordova) {
            if (typeof LokiCordovaFSAdapter === 'function') {
                return new LokiCordovaFSAdapter({ prefix: 'loki' });
            }
            else {
                this._logger.warn('LokiCordovaFSAdapter is not installed');
            }
        }
        return new loki.persistenceAdapters.localStorage();
    };
    MCSSyncModule.prototype.setHandler = function (handlerType) {
        var handler;
        switch (handlerType) {
            case types_1.SyncRequestHandlerTypes.GENERIC:
                handler = new generic_request_handler_1.GenericRequestHandler(this.options, this.common, this._utils, this._lokiStorageAdapter);
                break;
            case types_1.SyncRequestHandlerTypes.MCS:
                handler = new mcs_request_handler_1.McsRequestHandler(this.options, this.common, this._utils, this._lokiStorageAdapter);
                break;
            case types_1.SyncRequestHandlerTypes.ORACLE_REST:
                handler = new oracle_rest_request_handler_1.OracleRestRequestHandler(this.options, this.common, this._utils, this._lokiStorageAdapter);
                break;
        }
        this.options.module = handler;
    };
    MCSSyncModule.prototype._flush = function (path) {
        return this.options
            .module
            .flush(path)
            .then(this._sync.flushCollection.bind(this._sync));
    };
    MCSSyncModule.prototype._install = function () {
        sync_xml_http_request_1.xmlHttpRequestInstall(XMLHttpRequest, this._sync, this._utils, this.options, this.common, this._handler, this._events, this._logger);
    };
    MCSSyncModule.prototype._uninstall = function () {
        sync_xml_http_request_1.xmlHttpRequestUninstall();
    };
    MCSSyncModule.prototype._setTestMode = function () {
        this.options.isTest = true;
    };
    MCSSyncModule.prototype._setLogLevel = function (level) {
        logger_1.Logger.logLevel = level;
    };
    MCSSyncModule.prototype._setLogHTTP = function (logHTTP) {
        this._sync._setLogHTTP(logHTTP);
    };
    return MCSSyncModule;
}());
exports.MCSSyncModule = MCSSyncModule;
MCSSyncModuleGlobal = MCSSyncModule;


/***/ })
/******/ ]);

  // export mcs sync library
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

  __global.mcs = __global.mcs || {};
  __global.mcs.sync = new MCSSyncModuleGlobal();

})(typeof module === "undefined" ? undefined : module,
  typeof exports === "undefined" ? undefined : exports,
  typeof define === "undefined" ? undefined : define,
  typeof window === "undefined" ? undefined : window,
  typeof global === "undefined" ? undefined : global,
  typeof self === "undefined" ? undefined : self,
  this);

