import { AmqpEngineFactory, ConnectionDescription } from './types';
export declare type EngineFactoryCreator = (c: ConnectionDescription) => AmqpEngineFactory;
export declare const createInjectableAmqpConnector: (createConnectedFactory: EngineFactoryCreator) => (input: any) => {
    close: () => Promise<void>;
    receiver: (r: import("src/middleware/amqp/types/Receiver").ReceiverDescription) => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageIn>;
    sender: () => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageOut>;
};
declare const _default: (input: any) => {
    close: () => Promise<void>;
    receiver: (r: import("src/middleware/amqp/types/Receiver").ReceiverDescription) => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageIn>;
    sender: () => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageOut>;
};
export default _default;
