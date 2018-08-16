/// <reference types="node" />
export declare type AmqpProtocolMessage = {
    content: Buffer;
    fields: any;
    properties: any;
};
export declare type AmqpEngineFactory = (setup?: (channel: AmqpEngine) => Promise<AmqpEngine>, teardown?: (params: {
    err: Error;
}) => Promise<void>) => Promise<AmqpEngine>;
export declare type AmqpEngine = {
    closeConnection: () => Promise<void>;
    assertExchange(exchange: string, type: string, options?: any): Promise<{
        exchange: string;
    }>;
    assertQueue(queue: string, options?: any): Promise<{
        queue: string;
    }>;
    bindQueue(queue: string, source: string, pattern: string, args?: any): Promise<any>;
    bindExchange(destination: string, source: string, pattern: string, args?: any): Promise<any>;
    prefetch(count: number, global?: boolean): Promise<{}>;
    consume(queue: string, onMessage: (msg: AmqpProtocolMessage | null) => any, options?: any): Promise<any>;
    ack(message: AmqpProtocolMessage, allUpTo?: boolean): void;
    publish(exchange: string, routingKey: string, content: Buffer, options?: any): boolean;
};
export declare type AmqpTestEngine = AmqpEngine & {
    onReady: (callback: (() => void)) => void;
};
