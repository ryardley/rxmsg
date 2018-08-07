/// <reference types="node" />
import { IMessage } from '../../domain';
export interface IRabbitQueueFull {
    name: string;
    durable?: boolean;
    exclusive?: boolean;
    autoDelete?: boolean;
    arguments?: any;
}
export declare type IRabbitQueue = IRabbitQueueFull | string;
export interface IRabbitExchange {
    name: string;
    type: 'fanout' | 'topic' | 'direct';
    durable?: boolean;
    internal?: boolean;
    autoDelete?: boolean;
    alternateExchange?: string;
    arguments?: any;
}
export interface IRabbitReceiver {
    queue?: string;
    consumerTag?: string;
    noAck?: boolean;
    exclusive?: boolean;
    priority?: number;
    arguments?: object;
    prefetch?: number;
    bindings?: IRabbitBinding[];
}
export interface IRabbitConnection {
    uri: string;
    socketOptions?: {
        noDelay?: boolean;
        cert?: Buffer;
        key?: Buffer;
        passphrase?: string;
        ca?: Buffer[];
    };
}
export interface IRabbitDeclarations {
    queues?: IRabbitQueue[];
    exchanges?: IRabbitExchange[];
    bindings?: IRabbitBinding[];
}
export declare type IRabbitConfig = IRabbitConnection & {
    declarations?: IRabbitDeclarations;
};
export declare type IRabbitRoute = {
    exchange: string;
    key?: string;
} | string;
export interface IRabbitMessage extends IMessage {
    route?: IRabbitRoute;
    meta?: {
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
}
export interface IRabbitMessageProducer extends IRabbitMessage {
    mandatory?: true;
    bcc?: string | string[];
    immediate?: boolean;
}
export interface IRabbitMessageConsumed extends IRabbitMessage {
    ack?: () => void;
    route: {
        exchange: string;
        key?: string;
    };
}
export interface IRabbitBinding {
    arguments?: any;
    destination?: string;
    pattern?: string;
    source: string;
    type?: 'exchange' | 'queue';
}
