/**
 * Copyright© 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * @author Yuri Panshin
 */
/**
 *
 */
interface INotificationMessage {
    title: string;
    body: string;
    CampaignId?: string;
    $meta?: {
        tapped: boolean;
    };
}
export { INotificationMessage };
