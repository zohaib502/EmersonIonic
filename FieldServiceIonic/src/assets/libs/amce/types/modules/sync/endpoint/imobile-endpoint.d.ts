/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { ISynchronization } from "../isynchronization";
import { IFetchCollectionBuilder } from "./ifetch-collection-builder";
interface IMobileEndpoint {
    /**
     * The [Synchronization]{@link Synchronization} object that this MobileEndpoint instance belongs to.
     * @type {Synchronization}
     * @readonly
     */
    synchronization: ISynchronization;
    /**
     * The name of the custom code API.
     * @type {String}
     * @readonly
     */
    apiName: string;
    /**
     * The endpoint in the API.
     * @type {String}
     * @readonly
     */
    endpointPath: string;
    /**
     * Deletes all cached resources.
     */
    purge(): void;
    /**
     * Creates a new MobileObject. The object is not uploaded to the service until [save()]{@link MobileObject#save} is invoked.
     * @returns A new MobileObject.
     */
    createObject(object: any): any;
    /**
     * Fetches an object from the API's endpoint.
     * @param id {String} The ID of the object.
     * @param fetchFromService {Boolean} If true will download from the service; if false will return any pinned object
     * and will trigger a background refresh.
     * @return {Promise<MobileObject|NetworkResponse>}
     */
    fetchObject(id: any, fetchFromService: any): any;
    /**
     * Method to fetch a collection of objects from the endpoint. If the collection exists in the cache, the cached copy is returned; otherwise it is downloaded from the service..
     * @return {FetchCollectionBuilder}
     */
    fetchObjects(): IFetchCollectionBuilder;
}
export { IMobileEndpoint };
