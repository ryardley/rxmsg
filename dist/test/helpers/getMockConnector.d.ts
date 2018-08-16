import { MockEngineConfig } from '../../src/middleware/amqp/mockEngine';
export default function getMockedConnector(config?: MockEngineConfig): {
    channel: import("src/middleware/amqp/types/AmqpChannel").AmqpEngine & {
        onReady: (callback: () => void) => void;
    } & import("test/helpers/jestSpyObject").IJ;
    createAmqpConnector: (input: any) => {
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
};
