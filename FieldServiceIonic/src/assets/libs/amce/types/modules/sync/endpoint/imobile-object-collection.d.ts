/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { IMobileResource } from "./imobile-resource";
interface IMobileObjectCollection {
    /**
     * The count of items in the collection
     * @returns {number}
     */
    getLength(): number;
    /**
     * Return specific object from collection.
     * @param idx {number} item position in collection.
     * @return {MobileResource}
     */
    getItem(idx: any): IMobileResource;
    /**
     * Return all objects from collection.
     * @return {Array<MobileResource>}
     */
    all(): IMobileResource[];
    /**
     * Run method per item
     * @param method {Function} method to run on item.
     */
    forEach(method: any): void;
}
export { IMobileObjectCollection };
