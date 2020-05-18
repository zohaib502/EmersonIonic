/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
import { IStorageCollection } from './istorage-collection';
import { INetworkResponse } from '../responses/inetwork-response';
import { IStorage } from './istorage';
import { IStorageObject } from './istorage-object';
import { ContentTypes, XMLHttpRequestResponseTypes } from '../types';
declare class StorageObject implements IStorageObject {
    private storageCollection;
    /**
     * Payload of the object in string format
     */
    _payload: string;
    _eTag: string;
    /**
     * A service generated ID for the StorageObject. The ID is unique in the StorageCollection.
     * @type {String}
     * @name StorageObject#id
     * @mcs
     */
    id: string;
    /**
     * A user-provided name for the StorageObject. A StorageCollection may have multiple StorageObjects with the same name.
     * @type {String}
     * @name StorageObject#name
     * @mcs
     */
    name: string;
    /**
     * The length of data content in bytes stored in the StorageObject.
     * @type {Number}
     * @name StorageObject#contentLength
     * @mcs
     */
    contentLength: number;
    /**
     * The media-type associated with the StorageObject.
     * @type {String}
     * @name StorageObject#contentType
     * @mcs
     */
    contentType: ContentTypes;
    /**
     * The name of the user who created the StorageObject.
     * @type {String}
     * @name StorageObject#createdBy
     * @mcs
     */
    createdBy: string;
    /**
     * Server-generated timestamp when the StorageObject was created.
     * @type {String}
     * @name StorageObject#createdOn
     * @mcs
     */
    createdOn: string;
    /**
     * The name of the user who last updated the StorageObject.
     * @type {String}
     * @name StorageObject#modifiedBy
     * @mcs
     */
    modifiedBy: string;
    /**
     * Server-generated timestamp for when the StorageObject was last updated.
     * @type {String}
     * @name StorageObject#modifiedOn
     * @mcs
     */
    modifiedOn: string;
    /**
     * @classdesc Class that represents a storage object resource that can be used to store data.
     * This class constructor accessible by [mcs.StorageObject]{@link mcs.StorageObject} method.
     * @param storageCollection {StorageCollection}
     * @param json {Object}
     * @class
     * @global
     * @mcs
     */
    constructor(storageCollection: IStorageCollection, json?: any);
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
    getPayload(): string | any;
    /**
     * Set payload.
     * Sets the payload for the StorageObject.
     *
     * @function
     * @name StorageObject#setPayload
     * @param payload The payload to be associated with StorageObject.
     * @mcs
     */
    setPayload(payload: string | any): void;
    /**
     * Get storage collection.
     * Returns the current StorageCollection.
     *
     * @function
     * @name StorageObject#getstorageCollection
     * @return Current StorageCollection.
     * @mcs
     */
    getstorageCollection(): IStorageCollection;
    /**
     * Get storage.
     * Returns the current StorageObject.
     *
     * @function
     * @name StorageObject#getStorage
     * @return Current StorageObject.
     * @mcs
     */
    getStorage(): IStorage;
    /**
     * Load payload.
     * Loads a StorageObject's contents from an object.
     * @function
     * @name StorageObject#loadPayload
     * @param payload {Object} The object to load from.
     * @param contentType {String} The media-type to associate with the content.
     * @mcs
     */
    loadPayload(payload: any | string, contentType: ContentTypes): void;
    /**
     * Set display name.
     * Sets a StorageObject's display name from an object.
     * @function
     * @name StorageObject#setDisplayName
     * @param name {Object} The object's name to be associated with the object.
     * @returns The object's name in UTC-8 ASCII format.\
     * @mcs
     */
    setDisplayName(name: any): void;
    /**
     * Get Display name.
     * Returns a StorageObject's display name from an object.
     *
     * @function
     * @name StorageObject#getDisplayName
     * @returns {String} object's name decoded if encoded into the MobileBackend.
     * @mcs
     */
    getDisplayName(): string;
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
    readPayload(objectType: XMLHttpRequestResponseTypes): Promise<IStorageObject | INetworkResponse>;
}
export { StorageObject };
