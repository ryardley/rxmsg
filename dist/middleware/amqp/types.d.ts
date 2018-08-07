/// <reference types="node" />
import { IMessage } from '../../types';
export interface IAmqpQueueFull {
    name: string;
    durable?: boolean;
    exclusive?: boolean;
    autoDelete?: boolean;
    arguments?: any;
}
export declare type IAmqpQueue = IAmqpQueueFull | string;
export interface IAmqpExchange {
    name: string;
    type: 'fanout' | 'topic' | 'direct';
    durable?: boolean;
    internal?: boolean;
    autoDelete?: boolean;
    alternateExchange?: string;
    arguments?: any;
}
export interface IAmqpReceiver {
    queue?: string;
    consumerTag?: string;
    noAck?: boolean;
    exclusive?: boolean;
    priority?: number;
    arguments?: object;
    prefetch?: number;
    bindings?: IAmqpBinding[];
}
export interface IAmqpConnection {
    uri: string;
    socketOptions?: {
        noDelay?: boolean;
        cert?: Buffer;
        key?: Buffer;
        passphrase?: string;
        ca?: Buffer[];
    };
}
export interface IAmqpDeclarations {
    queues?: IAmqpQueue[];
    exchanges?: IAmqpExchange[];
    bindings?: IAmqpBinding[];
}
export declare type IAmqpConfig = IAmqpConnection & {
    declarations?: IAmqpDeclarations;
};
export declare type IAmqpRoute = {
    exchange: string;
    key?: string;
} | string;
export interface IAmqpMessage extends IMessage {
    route: IAmqpRoute;
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
}
export interface IAmqpMessageOut extends IAmqpMessage {
    mandatory?: true;
    bcc?: string | string[];
    immediate?: boolean;
}
export interface IAmqpMessageIn extends IAmqpMessage {
    ack?: () => void;
    route: {
        exchange: string;
        key?: string;
    };
}
export interface IAmqpBinding {
    arguments?: any;
    destination?: string;
    pattern?: string;
    source: string;
    type?: 'exchange' | 'queue';
}
