/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 * Created by Yuri Panshin on 2016-08-26.
 */
import { NetworkResponseHeaders } from "../types";
/**
 * Class that provides network response details.
 * @global
 */
interface INetworkResponse {
    /**
     * The network status code.
     * The status is zero when browser has error to establish connection with the server.
     * @type {Number}
     */
    readonly statusCode: number;
    /**
     * Data object.
     * The data was returned from server.
     * @type {Object}
     */
    readonly data: any;
    /**
     * The response headers.
     * This object in format of dictionary with lowercase keys.
     * @type {NetworkResponseHeaders}
     */
    readonly headers: NetworkResponseHeaders;
}
export { INetworkResponse };
