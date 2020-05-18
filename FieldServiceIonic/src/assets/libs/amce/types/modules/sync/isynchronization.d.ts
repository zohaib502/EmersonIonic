/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 */
import { IBackend } from '../mobile-backend/ibackend';
import { IMobileEndpoint } from './endpoint/imobile-endpoint';
interface ISynchronization {
    /**
     * The [MobileBackend]{@link Backend} object that this Synchronization instance belongs to.
     * @type {Backend}
     * @readonly
     */
    backend: IBackend;
    /**
     * Sets the device to offline mode, which is good for testing.
     * If the device is in real offline mode, then this setting will be ignored
     * @param isOffline whether to set the device online or offline.
     */
    setOfflineMode: (isOffline: boolean) => void;
    /**
     * Gets device network status which is currently being used by Synchronization.
     * @returns {Boolean}
     */
    isOnline(): boolean;
    /**
     * Deletes all cached resources.
     */
    purge(): any;
    /**
     * Returns a [MobileEndpoint]{@link MobileEndpoint} that provides access to an endpoint in a custom code API.
     * @param apiName The name of the custom code API
     * @param endpointPath The endpoint in the custom code API
     * @returns A MobileEndpoint object.
     */
    openEndpoint(apiName: string, endpointPath: string): IMobileEndpoint;
}
export { ISynchronization };
