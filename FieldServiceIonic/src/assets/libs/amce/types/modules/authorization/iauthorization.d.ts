/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
interface IAuthorization {
    /**
     * Returns true if a user has been authorized, false otherwise. A user can be authorized by calling authenticate() or authenticateAnonymous().
     * @type {Boolean}
     */
    readonly isAuthorized: boolean;
    /**
     * Returns the current access token from user credentials.
     * @return {String} current access token from user credentials.
     */
    getAccessToken(): string;
    /**
     * Returns true if the access token returned by the service is still valid.
     * @returns {Boolean}
     */
    isTokenValid(): boolean;
    /**
     * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
     */
    authenticateAnonymous(): any;
    /**
     * Refreshes the authentication token if it has expired. The authentication scheme should support refresh.
     */
    refreshToken(): any;
    /**
     * Logs out the current user and clears credentials and tokens.
     */
    logout(): void;
    /**
     * Subscribe for on authentication event
     * @param {(token: string) => void} callback
     */
    onAuthentication(callback: (token: string) => void): void;
}
export { IAuthorization };
