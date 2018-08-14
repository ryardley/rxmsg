import { IMockEngineConfig } from '../../src/middleware/amqp/mockEngine';
export default function getMockedConnector(config?: IMockEngineConfig): {
    channel: import("src/middleware/amqp/types").IAmqpEngine & import("src/middleware/amqp/types").IWithOnReady & import("test/helpers/jestSpyObject").IJ;
    createAmqpConnector: (config: import("src/middleware/amqp/types").IAmqpSystemDescription) => {
        close: () => Promise<void>;
        receiver: (r: import("src/middleware/amqp/types").IAmqpReceiverDescription) => import("src/types").Middleware<import("src/middleware/amqp/types").IAmqpMessageIn>;
        sender: () => import("src/types").Middleware<import("src/middleware/amqp/types").IAmqpMessageOut>;
    };
};
