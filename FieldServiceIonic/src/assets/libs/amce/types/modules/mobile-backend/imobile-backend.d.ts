/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
import { INotifications } from '../notifications/inotifications';
import { IBackend } from './ibackend';
export interface IMobileBackend extends IBackend {
    /**
     * Returns the Notifications object that provides notification capabilities.
     * @type {Notifications}
     */
    readonly notifications: INotifications;
}
