/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { IStorageCollection } from "./istorage-collection";
import { IStorage } from "./istorage";
import { INetworkResponse } from "../responses/inetwork-response";
interface IStorageObject {
    /**
     * A service generated ID for the StorageObject. The ID is unique in the StorageCollection.
     * @type {String}
     */
    id: string;
    /**
     * A user-provided name for the StorageObject. A StorageCollection may have multiple StorageObjects with the same name.
     * @type {String}
     */
    name: string;
    /**
     * The length of data content in bytes stored in the StorageObject.
     * @type {Number}
     */
    contentLength: number;
    /**
     * The media-type associated with the StorageObject.
     * @type {String}
     */
    contentType: string;
    /**
     * The name of the user who created the StorageObject.
     * @type {String}
     */
    createdBy: string;
    /**
     * Server-generated timestamp when the StorageObject was created.
     * @type {String}
     */
    createdOn: string;
    /**
     * The name of the user who last updated the StorageObject.
     * @type {String}
     */
    modifiedBy: string;
    /**
     * Server-generated timestamp for when the StorageObject was last updated.
     * @type {String}
     */
    modifiedOn: string;
    /**
     * Returns the current StorageObject payload.
     *
     * @return {string} Current Storage object payload.
     */
    getPayload(): string;
    /**
     * Sets the payload for the StorageObject.
     *
     * @param {string} payload The payload to be associated with StorageObject.
     */
    setPayload(payload: string): void;
    /**
     * Returns the current StorageCollection.
     *
     * @return Current StorageCollection.
     */
    getstorageCollection(): IStorageCollection;
    /**
     * Returns the current StorageObject.
     *
     * @return Current StorageObject.
     */
    getStorage(): IStorage;
    /**
     * Loads a StorageObject's contents from an object.
     * @param payload {Object} The object to load from.
     * @example payload: "Hello my name is Mia and this is a sample payload".
     * @param contentType {String} The media-type to associate with the content.
     * @example contentType: "application/json,text/plain".
     */
    loadPayload(payload: string, contentType: string): void;
    /**
     * Sets a StorageObject's display name from an object.
     * @param name {Object} The object's name to be associated with the object.
     * @example name: "JSFile中国人.txt"
     * @returns The object's name in UTC-8 ASCII format.
     */
    setDisplayName(name: string): void;
    /**
     * Returns a StorageObject's display name from an object.
     *
     * @returns String object's name decoded if encoded into the MobileBackend.
     */
    getDisplayName(): string;
    /**
     * Returns the contents of the StorageObject. May result in a download from the service if the contents were not
     * previously downloaded.
     * @param objectType responseType for the XMLHttpRequest Object.
     * @return {Promise<StorageObject|NetworkResponse>}
     */
    readPayload(objectType: string): Promise<IStorageObject | INetworkResponse>;
}
export { IStorageObject };
