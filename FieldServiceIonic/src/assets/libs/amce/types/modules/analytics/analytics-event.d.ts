/**
 * Copyright© 2016, Oracle and/or its affiliates. All rights reserved.
 */
declare class AnalyticsEvent {
    type: string;
    /**
     * The name of the event.
     * @type {String}
     * @name AnalyticsEvent#name
     * @mcs
     */
    name: string;
    /**
     * The timestamp of the event. The system will populate with the current time by default.
     * @type {String}
     * @name AnalyticsEvent#timestamp
     * @mcs
     */
    timestamp: string;
    /**
     * The ID of the current session.
     * @type {String}
     * @name AnalyticsEvent#sessionID
     * @mcs
     */
    sessionID: string;
    /**
     * Custom caller specifiable properties as key/value strings.
     * @type {Object}
     * @name AnalyticsEvent#properties
     * @mcs
     */
    properties: any;
    /**
     * @classdesc Class that holds an analytics event.
     * This class constructor accessible by [mcs.AnalyticsEvent]{@link mcs.AnalyticsEvent} method.
     * @param {string} name - event name
     * @constructor
     * @class
     * @global
     * @mcs
     */
    constructor(name: string);
}
export { AnalyticsEvent };
