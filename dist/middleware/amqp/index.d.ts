import { IAmqpConfig } from './types';
declare const _default: (c?: IAmqpConfig) => {
    close: () => Promise<void>;
    receiver: (r: import("src/middleware/amqp/types").IAmqpReceiver) => import("src/types").Middleware<import("src/middleware/amqp/types").IAmqpMessageConsumed>;
    sender: () => (stream: import("../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/rxjs/internal/Observable").Observable<import("src/middleware/amqp/types").IAmqpMessageProducer>) => import("../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/rxjs/internal/Observable").Observable<import("src/middleware/amqp/types").IAmqpMessageProducer>;
};
export default _default;
