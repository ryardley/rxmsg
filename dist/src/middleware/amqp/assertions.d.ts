import { AmqpDeclarations, AmqpEngine, BindingDescription, ExchangeDescription, QueueDescription, QueueShortDescription } from './types';
export declare function enrichQueue(queueOrString: QueueShortDescription): QueueDescription;
export declare function containsQueue(array: QueueShortDescription[] | undefined, queue: QueueShortDescription): void;
export declare function assertQueue(channel: AmqpEngine, queue: QueueShortDescription): Promise<{
    queue: string;
}>;
export declare function assertQueues(channel: AmqpEngine, queues: QueueShortDescription[]): Promise<{
    queue: string;
}[]>;
export declare function assertExchanges(channel: AmqpEngine, exchanges: ExchangeDescription[]): Promise<{
    exchange: string;
}[]>;
export declare function assertIfAnonymousQueue(channel: AmqpEngine, queue: string): Promise<string>;
export declare function assertBindings(channel: AmqpEngine, bindings: BindingDescription[], defaultQueue: string): Promise<any[]>;
export declare function assertDeclarations(channel: AmqpEngine, declarations: AmqpDeclarations): Promise<[{
    queue: string;
}[], {
    exchange: string;
}[]]>;
