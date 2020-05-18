/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
export interface IDictionary<KeyT, ValT> {
    add(key: KeyT, value: ValT): void;
    remove(key: KeyT): void;
    containsKey(key: KeyT): boolean;
    keys(): KeyT[];
    values(): ValT[];
}
export declare class Dictionary<KeyT, ValT> implements IDictionary<KeyT, ValT> {
    _keys: KeyT[];
    _values: ValT[];
    constructor(init: {
        key: KeyT;
        value: ValT;
    }[]);
    add(key: KeyT, value: ValT): void;
    remove(key: KeyT): void;
    keys(): KeyT[];
    values(): ValT[];
    containsKey(key: KeyT): boolean;
    toLookup(): IDictionary<KeyT, ValT>;
}
