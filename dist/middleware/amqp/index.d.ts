import { IAmqpEngineConfigurator, IAmqpSystemDescription } from './types';
export declare const createInjectableAmqpConnector: (configureEngine: IAmqpEngineConfigurator) => (config: IAmqpSystemDescription) => {
    close: () => Promise<void>;
    receiver: (r: import("src/middleware/amqp/types").IAmqpReceiverDescription) => import("src/types").Middleware<import("src/middleware/amqp/types").IAmqpMessageIn>;
    sender: () => import("src/types").Middleware<import("src/middleware/amqp/types").IAmqpMessageOut>;
};
declare const _default: (config: IAmqpSystemDescription) => {
    close: () => Promise<void>;
    receiver: (r: import("src/middleware/amqp/types").IAmqpReceiverDescription) => import("src/types").Middleware<import("src/middleware/amqp/types").IAmqpMessageIn>;
    sender: () => import("src/types").Middleware<import("src/middleware/amqp/types").IAmqpMessageOut>;
};
export default _default;
