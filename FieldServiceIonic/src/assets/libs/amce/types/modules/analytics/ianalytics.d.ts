/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
import { INetworkResponse } from "../responses/inetwork-response";
import { AnalyticsEvent } from "./analytics-event";
export interface IAnalytics {
    /**
     * Returns session ID for current session.
     * @returns {String}
     */
    getSessionId(): string;
    /**
     * Starts a new session. If one is in progress, then a new session will not be created.
     */
    startSession(): void;
    /**
     * Ends a session if one exists.
     * @return {Promise<Undefined|NetworkResponse>}
     */
    endSession(location: any): Promise<INetworkResponse>;
    /**
     * Creates a new analytics event with the given name.
     * @param name {String} The name of the event.
     * @returns {AnalyticsEvent} The [AnalyticsEvent]{@link AnalyticsEvent} instance that was logged.
     */
    logNamedEvent(name: string): AnalyticsEvent;
    /**
     * Writes out an analytics event. It will implicitly call startSession(),
     * which will add a new event to the list of events for Oracle Mobile Cloud Enterprise to consume
     * @param event {AnalyticsEvent} The event to log.
     * @example event: "GettingStartedJSEvent"
     * @returns {AnalyticsEvent} The [AnalyticsEvent]{@link AnalyticsEvent} instance that was logged.
     */
    logEvent(event: AnalyticsEvent): AnalyticsEvent;
    /**
     * Uploads all events to the service if the device is online or caches them locally until the device goes online, at
     * which point they will be uploaded. If a session is in progress it will end.
     * @return {Promise<NetworkResponse>}
     */
    flush(location: any): Promise<INetworkResponse>;

    _setEvents(events: AnalyticsEvent[]): void;

    _getEvents(): AnalyticsEvent[];
}
