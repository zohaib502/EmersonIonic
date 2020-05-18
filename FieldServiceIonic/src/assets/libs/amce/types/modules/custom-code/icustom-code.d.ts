/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { INetworkResponse } from "../responses/inetwork-response";
interface ICustomCode {
    invokeCustomCodeJSONRequest(path: string, method: string, data: any): Promise<INetworkResponse>;
    setAccsHeaderValue(accsToken): void;
}
export { ICustomCode };
