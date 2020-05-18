/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 */
import { StorageObject } from './storage/storage-object';
import { AnalyticsEvent } from './analytics/analytics-event';
import { IOracleMobileCloudConfig } from './config/iconfig';
export interface IMCSModule {
    /**
     * Log levels enum.
     * @enum {number}
     */
    LOG_LEVEL?: {
        NONE: number;
        ERROR: number;
        WARN: number;
        INFO: number;
        DEBUG: number;
    };
    /**
     * Access point to class that represents a storage object resource that can be used to store data.
     * @param storageCollection {StorageCollection}
     * @param [json] {Object} Json storage object representation
     * @returns {StorageObject}
     */
    StorageObject?: typeof StorageObject;
    /**
     * Analytics event constructor
     * @type {AnalyticsEvent}
     */
    AnalyticsEvent?: typeof AnalyticsEvent;
    /**
     * Init MCS with configuration
     * @param {OracleMobileCloudConfig} config - MCS configuration
     */
    init?: (config: IOracleMobileCloudConfig) => void;
}
