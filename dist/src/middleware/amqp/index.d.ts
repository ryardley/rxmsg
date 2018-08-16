import { AmqpEngineFactory, ConnectionDescription } from './types';
export declare type EngineFactoryCreator = (c: ConnectionDescription) => AmqpEngineFactory;
export declare const createInjectableAmqpConnector: (createConnectedFactory: EngineFactoryCreator) => (input: any) => {
    close: () => Promise<void>;
    receiver: (r: {
        arguments?: {
            [_: string]: any;
        } | undefined;
        bindings?: ({
            source: string;
        } & any)[] | undefined;
        consumerTag?: string | undefined;
        exclusive?: boolean | undefined;
        noAck?: boolean | undefined;
        prefetch?: number | undefined;
        priority?: number | undefined;
        queue?: string | undefined;
    }) => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageIn>;
    sender: () => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageOut>;
};
declare const _default: (input: any) => {
    close: () => Promise<void>;
    receiver: (r: {
        arguments?: {
            [_: string]: any;
        } | undefined;
        bindings?: ({
            source: string;
        } & any)[] | undefined;
        consumerTag?: string | undefined;
        exclusive?: boolean | undefined;
        noAck?: boolean | undefined;
        prefetch?: number | undefined;
        priority?: number | undefined;
        queue?: string | undefined;
    }) => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageIn>;
    sender: () => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageOut>;
};
export default _default;
