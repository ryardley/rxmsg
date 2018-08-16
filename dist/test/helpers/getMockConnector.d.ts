import { MockEngineConfig } from '../../src/middleware/amqp/mockEngine';
export default function getMockedConnector(config?: MockEngineConfig): {
    channel: import("src/middleware/amqp/types/AmqpChannel").AmqpEngine & {
        onReady: (callback: () => void) => void;
    } & import("test/helpers/jestSpyObject").IJ;
    createAmqpConnector: (input: any) => {
        close: () => Promise<void>;
        receiver: (r: import("src/middleware/amqp/types/Receiver").ReceiverDescription) => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageIn>;
        sender: () => import("src/types").Middleware<import("src/middleware/amqp/types/Message").AmqpMessageOut>;
    };
};
