/**
* Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
*/
import { IStorageCollection } from "./istorage-collection";
import { INetworkResponse } from "../responses/inetwork-response";
export interface IStorage {
    /**
     * Returns a StorageCollection with the given name from the service associated with the user. Subsequent accesses to StorageObjects in the
     * StorageCollection will only return StorageObjects owned by the user.
     * @param name {String} The name of the StorageCollection.
     * @example name: "JSCollection"
     * @param userId {String} Optional, the ID of the user retrieved from the UI.
     * @example userId: "e8671189-585d-478e-b437-005b7632b8803"
     * @param [userIsolated] {Boolean} - indicate if collection is in isolated mode, used in combination with lazyLoad and userId.
     * This parameter is not required in case lazyLoad is not provided.
     * @param [lazyLoad] {Boolean} - indicate not to load collection metadata
     * @return {Promise<StorageCollection|NetworkResponse>}
     */
    getCollection(name: string, userId?: string, userIsolated?: boolean, lazyLoad?: boolean): Promise<IStorageCollection | INetworkResponse>;
}
