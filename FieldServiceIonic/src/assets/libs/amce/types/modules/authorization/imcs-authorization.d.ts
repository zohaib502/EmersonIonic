import { INetworkResponse } from "../responses/inetwork-response";
import { IAuthorization } from "./iauthorization";
/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
interface IMCSAuthorization extends IAuthorization {
    /**
     * Returns the user resource associated with the logged in user.
     * @return {Promise<Authorization~CurrentUserData|NetworkResponse>}
     * @example <caption>Example usage of mcs.mobileBackend.authorization.getCurrentUser()</caption>
     * mcs.mobileBackend.authorization.getCurrentUser().then(
     * function(data){
  * },
     * function(exception){
  * });
     {
       "id": "c9a5fdc5-737d-4e93-b292-d258ba334149",
       "username": "DwainDRob",
       "email": "js_sdk@mcs.com",
       "firstName": "Mobile",
       "lastName": "User",
       "properties": {}
     }
     */
    getCurrentUser(): any;
    /**
     * Authenticates a user with the given credentials against the service. The user remains logged in until logout() is called.
     * @return {Promise<NetworkResponse>}
     */
    authenticate(...params: any[]): Promise<INetworkResponse>;
    /**
     * Returns the username of the current authorized user if any, null otherwise.
     * @type {String}
     */
    getAuthorizedUserName(): string;
}
export { IMCSAuthorization };
