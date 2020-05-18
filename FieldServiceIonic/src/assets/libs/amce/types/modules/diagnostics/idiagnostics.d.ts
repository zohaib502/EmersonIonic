/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
/**
 * Describes diagnostics capabilities.
 */
interface IDiagnostics {
    /**
     * Returns the session ID or process ID of the Diagnostics event.
     * @return {string} process id for the Diagnostics session.
     */
    getSessionId(): string;
}
export { IDiagnostics };
