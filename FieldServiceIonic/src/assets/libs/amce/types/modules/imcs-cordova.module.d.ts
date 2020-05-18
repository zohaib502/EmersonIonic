/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 */
import { IMCSModule } from './imcs.module';
import { IMobileBackend } from './mobile-backend/imobile-backend';
export interface IMCSCordovaModule extends IMCSModule {
    /**
     * Authentication types enum.
     * @enum {string}
     */
    AUTHENTICATION_TYPES?: {
        basic: string;
        oauth: string;
        facebook: string;
        token: string;
    };
    /**
     * Mobile backend object.
     * Represents a mobile backend in Oracle Mobile Cloud Enterprise
     * and provides access to all capabilities of the backend.
     * @readonly
     * @type {MobileBackend}
     * @instance
     */
    mobileBackend?: IMobileBackend;
}
