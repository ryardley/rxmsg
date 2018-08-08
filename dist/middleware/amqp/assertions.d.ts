import { IAmqpBinding, IAmqpDeclarations, IAmqpEngine, IAmqpExchangeDescription, IAmqpQueueDescription, IAmqpQueueShortDescription } from './types';
export declare function enrichQueue(queueOrString: IAmqpQueueShortDescription): IAmqpQueueDescription;
export declare function containsQueue(array: IAmqpQueueShortDescription[], queue: IAmqpQueueShortDescription): void;
export declare function assertQueue(channel: IAmqpEngine, queue: IAmqpQueueShortDescription): Promise<{
    queue: string;
}>;
export declare function assertQueues(channel: IAmqpEngine, queues: IAmqpQueueShortDescription[]): Promise<{
    queue: string;
}[]>;
export declare function assertExchanges(channel: IAmqpEngine, exchanges: IAmqpExchangeDescription[]): Promise<{
    exchange: string;
}[]>;
export declare function assertIfAnonymousQueue(channel: IAmqpEngine, queue: string): Promise<string>;
export declare function assertBindings(channel: IAmqpEngine, bindings: IAmqpBinding[], defaultQueue: string): Promise<any[]>;
export declare function assertDeclarations(channel: IAmqpEngine, declarations: IAmqpDeclarations): Promise<[{
    queue: string;
}[], {
    exchange: string;
}[]]>;
