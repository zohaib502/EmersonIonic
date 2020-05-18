/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { INetworkResponse } from "../responses/inetwork-response";
import { NotificationProviders } from "../types";
/**
 * Describe notification capabilities.
 */
interface INotifications {
    /**
     * Returns a string with device information used by [Notifications]{@link Notifications}
     * @returns {String} The device specific information for platform.
     * @example : "IOS,ANDROID"
     */
    getDevicePlatform(): string;
    /**
     * Registers the current Cordova app running on the device for receiving push notifications.
     * @param deviceToken {String} Platform-specific device token.
     * @example deviceToken: "AxdkfjfDfkfkfkfjfFdjfjjf=", deviceToken is sent from device.
     * @param packageName {String} Platform-specific application reverse domain identifier.
     * @example packageName: "com.yourcompany.project"
     * @param appVersion {String} Platform-specific application version..
     * @example appVersion: "1.0.2"
     * @param notificationProvider {String}
     * @return {Promise<NetworkResponse>}
     *
     * @example <caption>Example usage of mcs.MobileBackend.getNotifications().registerForNotifications()</caption>
     mcs.MobileBackend.getNotifications()
     .registerForNotifications("YOUR_DEVICE_TOKEN", "com.oracle.mobile.cloud.OMCPushNotifications", "1.0.0")
     .then(registerSuccess, registerError);
     function registerSuccess(response){
      console.log(response.statusCode);// returns statusCode for this function.
    }
     function registerError(response){
  
    }
     */
    registerForNotifications(deviceToken: string, packageName: string, appVersion: string, notificationProvider: NotificationProviders): Promise<INetworkResponse>;
    /**
     * Deregister from notifications.
     * Deregisters the current Cordova app running on the device for receiving push notifications.
     * @function
     * @name Notifications#deregisterForNotifications
     * @param deviceToken {String} Platform-specific success callback token.
     * @param packageName {String} Platform-specific application reverse domain identifier.
     * @param notificationProvider {String} The provider to register, posible values: 'APNS', 'FCM', 'WNS', 'SYNIVERSE'.
     * @return {Promise<NetworkResponse>}
     *
     * @example <caption>Example usage of mcs.mobileBackend.notifications.deregisterForNotifications()</caption>
     * mcs.mobileBackend
     *   .notifications
     *    .deregisterForNotifications('YOUR_DEVICE_TOKEN', 'com.yourcompany.project', '1.0.0', 'FCM')
     *    .then(deregisterSuccess)
     *    .catch(deregisterError);
     *
     * function deregisterSuccess(response){
     *   console.log(response);
     * }
     *
     * function deregisterError(response){
     *    console.log(response);
     * }
     */
    deregisterForNotifications(deviceToken: string, packageName: string, notificationProvider: NotificationProviders): Promise<INetworkResponse>;
}
export { INotifications };
