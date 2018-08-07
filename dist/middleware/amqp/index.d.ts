import { IRabbitConfig } from './domain';
declare const _default: (c?: IRabbitConfig) => {
    close: () => Promise<void>;
    receiver: (receiverConfig: import("src/middleware/amqp/domain").IRabbitReceiver) => () => any;
    sender: () => (stream: import("../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/rxjs/internal/Observable").Observable<import("src/middleware/amqp/domain").IRabbitMessageProducer>) => import("../../../../../../../../../Users/rudiyardley/client-projects/blockbid/microservices/blockbid-message/node_modules/rxjs/internal/Observable").Observable<import("src/middleware/amqp/domain").IRabbitMessageProducer>;
};
export default _default;
