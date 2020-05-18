/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
import { ICustomCode } from '../custom-code/icustom-code';
import { IStorage } from '../storage/istorage';
import { ISynchronization } from '../sync/isynchronization';
import { IDiagnostics } from '../diagnostics/idiagnostics';
import { IAnalytics } from '../analytics/ianalytics';
import { INetworkResponse } from '../responses/inetwork-response';
import { IMCSAuthorization } from '../authorization/imcs-authorization';
import { IDictionary } from '../dictionary';
import { Headers } from '../types';
export interface IBackend {
    /**
     * The name of the MobileBackend as read from the configuration.
     * @type {String}
     */
    readonly name: string;
    /**
     * Current authorization object.
     * @type {Authorization}
     */
    readonly authorization: IMCSAuthorization;
    /**
     * Diagnostics object that enables end-end debugging across application and cloud.
     * @type {Diagnostics}
     */
    readonly diagnostics: IDiagnostics;
    /**
     * Returns the CustomCode object that enables calls to custom APIs.
     * @type {CustomCode}
     */
    readonly customCode: ICustomCode;
    /**
     * Returns the Analytics object that enables capture of mobile analytics events.
     * @type {Analytics}
     * @deprecated Please use CXA Analytics by [mcs's cxaAnalytics property]{mcs#cxaAnalytics}
     */
    readonly analytics: IAnalytics;
    /**
     * Returns the Storage object that provides cloud-based object storage capabilities.
     * @type {Storage}
     */
    readonly storage: IStorage;
    /**
     * Returns the Synchronization object that provides caching and synchronization capabilities.
     * @type {Synchronization}
     */
    readonly synchronization: ISynchronization;
    /**
     * Returns an instance of the application configuration object.
     * Callers can download the configuration from the service by invoking loadAppConfig().
     * @type {Object}
     */
    readonly appConfig: any;
    /**
     * Constructs a full URL by prepending the prefix for platform API REST endpoints to the given endpoint path.
     * @param path {String} The relative path of the endpoint following the platform prefix, i.e. {BaseUrl}/mobile/platform.
     * @returns {String} The full URL.
     */
    getPlatformUrl(path: string): string;
    /**
     * Constructs a full URL by prepending the prefix for custom API REST endpoints to the given endpoint path.
     * @param path {String} The relative path of the endpoint following the platform prefix, i.e. {BaseUrl}/mobile/custom.
     * @returns {String} The full URL.
     */
    getCustomCodeUrl(path: any): string;
    /**
     * Populates auth and diagnostics HTTP headers for making REST calls to a mobile backend.
     * @param [headers] {Object} An optional object with which to populate with the headers.
     * @returns {Object} The headers parameter that is passed in. If not provided, a new object with the populated
     * headers as properties of that object is created.
     */
    getHttpHeaders(headers?: IDictionary<Headers, string>): IDictionary<Headers, string>;
    /**
     * Returns the Authentication type.
     * @return {String} Authentication type
     */
    getAuthenticationType(): string;
    /**
     * Returns the Authorization object that provides authorization capabilities and access to user properties.
     * @param {string} type.
     * For Basic Authentication, you would specify "basicAuth" to use the Basic Authentication security schema.
     * For OAuth authentication, you would specify "oAuth" to use OAuth Authentication security schema.
     * If you put any type other than those two, it will throw an Exception stating that the type of Authentication that you provided
     * is not supported at this time.
     * @type {Authorization}
     * @example <caption>Example usage of mobileBackend.setAuthenticationType()</caption>
     * @example mcs.mobileBackend.setAuthenicationType("basicAuth");
     * //Basic Authorization schema
     * @example mcs.mobileBackend.setAuthenicationType("oAuth");
     * //OAuth Authorization schema
     * @example mcs.mobileBackend.setAuthenicationType("facebookAuth");
     * //Facebook Authorization schema
     * @example mcs.mobileBackend.setAuthenicationType("ssoAuth");
     * //Single Sign On Authorization schema
     * @example mcs.mobileBackend.setAuthenicationType("tokenAuth");
     * //Token Exchange Authorization schema
     */
    setAuthenticationType(type: any): any;
    /**
     * Downloads the configuration from the service. The AppConfig property will contain the downloaded configuration.
     * @return {Promise<NetworkResponse>}
     */
    loadAppConfig(): Promise<INetworkResponse>;
}
