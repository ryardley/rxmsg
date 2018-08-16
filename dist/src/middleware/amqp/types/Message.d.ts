import { IMessage } from '../../../types';
export declare type RouteDescription = {
    exchange: string;
    key?: string;
} | string;
export declare type AmqpMessage = IMessage & {
    route: RouteDescription;
    expiration?: string;
    userId?: string;
    persistent?: boolean;
    cc?: string | string[];
    priority?: number;
    contentType?: string;
    contentEncoding?: string;
    headers?: object;
    correlationId?: string;
    replyTo?: string;
    messageId?: string;
    timestamp?: number;
    type?: string;
    appId?: string;
};
export declare type AmqpMessageOut = AmqpMessage & {
    mandatory?: true;
    bcc?: string | string[];
    immediate?: boolean;
};
export declare type AmqpMessageIn = AmqpMessage & {
    ack: () => void;
    route: {
        exchange: string;
        key?: string;
    };
};
