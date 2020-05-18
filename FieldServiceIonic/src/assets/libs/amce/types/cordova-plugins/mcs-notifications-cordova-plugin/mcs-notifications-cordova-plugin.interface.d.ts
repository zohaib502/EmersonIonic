/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { INotificationMessage } from "./notification-message.interface";
import { ILogMessage } from "./log-message.interface";
/**
 *
 */
interface IMCSNotificationsCordovaPlugin {
    /**
     * Set log level for plugin logger
     * @param {number} level - NONE: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4
     */
    setLogLevel(level: number): void;
    /**
     * Subscribe to token refresh event that called:
     * - to retrieve device token
     * - when the system determines that the device token need to be refreshed.
     * @param {MCSNotificationsCordovaPlugin~tokenRefreshCallback} callback - triggered on the new token received
     * @param {MCSNotificationsCordovaPlugin~errorCallback} [errorCallback] - triggered on the error
     */
    onTokenRefresh(callback: (token: string) => void, errorCallback: (error: any) => void): any;
    /**
     * This callback used to retrieve notification messages.
     * @callback MCSNotificationsCordovaPlugin~messageReceivedCallback
     * @param {INotificationMessage} message - notification message
     */
    /**
     * Subscribe to message received event
     * @param {MCSNotificationsCordovaPlugin~messageReceivedCallback} callback
     * @param {MCSNotificationsCordovaPlugin~errorCallback} [errorCallback] - triggered on the error
     */
    onMessageReceived(callback: (message: INotificationMessage) => void, errorCallback: (err: any) => void): any;
    /**
     * Subscribe to log received event
     * @param {MCSNotificationsCordovaPlugin~logReceivedCallback} callback
     * @param {MCSNotificationsCordovaPlugin~errorCallback} [errorCallback] - triggered on the error
     */
    onLogReceived(callback: (logMessage: ILogMessage) => void, errorCallback: (err: any) => void): any;
}
export { IMCSNotificationsCordovaPlugin };
