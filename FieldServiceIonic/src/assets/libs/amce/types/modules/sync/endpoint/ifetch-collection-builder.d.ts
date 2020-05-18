/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { INetworkResponse } from "../../responses/inetwork-response";
import { IMobileObjectCollection } from "./imobile-object-collection";
interface IFetchCollectionBuilder {
    /**
     * Executes the fetch and returns the results.
     * @return {Promise<MobileObjectCollection|NetworkResponse>}
     */
    execute(): Promise<IMobileObjectCollection | INetworkResponse>;
}
export { IFetchCollectionBuilder };
