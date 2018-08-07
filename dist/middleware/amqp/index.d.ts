import { IAmqpConfig } from './domain';
declare const _default: (c?: IAmqpConfig) => {
    close: () => Promise<void>;
    receiver: (receiverConfig: import("src/middleware/amqp/domain").IAmqpReceiver) => () => any;
    sender: () => (stream: import("../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/rxjs/internal/Observable").Observable<import("src/middleware/amqp/domain").IAmqpMessageProducer>) => import("../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/rxjs/internal/Observable").Observable<import("src/middleware/amqp/domain").IAmqpMessageProducer>;
};
export default _default;
