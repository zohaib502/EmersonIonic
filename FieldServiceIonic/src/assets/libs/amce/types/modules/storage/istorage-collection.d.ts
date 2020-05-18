/**
* Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
*/
import { INetworkResponse } from '../responses/inetwork-response';
import { IStorage } from './istorage';
export interface IStorageCollection {
    loadObjectPayload(objectId: string, objectType: string): Promise<INetworkResponse>;
    getStorage(): IStorage;
}
