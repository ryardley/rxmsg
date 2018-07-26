# blockbid-messaging

This library makes it easy to send messages in a distributed network transparent
way via various brokers but initially via RabbitMQ.

At a later point we should have plugins to make it work:

- via Kafka
- in the browser using socker.io
- on the server via socket.io
- locally through node spawned processes

Some principles:

- Modular middleware system inspired by Redux and Express
- Favour higher order functional configuration over classes inheritence and DI
- Basic framework should work in all V8 environments.

```typescript
import { Observable } from 'rxjs';

export interface IDestination {
  via: string;
  to: string;
}

export interface IMessage {
  payload: {};
  meta?: {};
  dest?: IDestination;
}

export interface IMessageClient {
  createProducer: () => any;
  createConsumer: () => any;
}

export interface IProducer {
  publish: (a: IMessage) => Promise<void>;
  destroy: () => Promise<{}>;
}

export interface IConsumer {
  messageStream: () => Observable<IMessage>;
  destroy: () => Promise<{}>;
}

export type ProducerMiddleware = (
  a: Observable<IMessage> | void
) => Observable<IMessage>;

export type ConsumerMiddleware = (
  a: Observable<IMessage>
) => Observable<IMessage> | void;

export type Middleware =
  | {
      consumer: ConsumerMiddleware;
      producer: ProducerMiddleware;
    }
  | ConsumerMiddleware
  | ProducerMiddleware;
```

```typescript
import {
  // Plugins
  createLoggerMiddleware,
  createRabbitMiddleware,

  // Core
  createMessageClient
} from 'blockbid-messaging';
import transformMessageSomehow from './transformMessageSomehow';

(async () => {
  try {
    const rabbitMiddleware: Middleware = createRabbitMiddleware({
      uri:
        'amqp://xvjvsrrc:VbuL1atClKt7zVNQha0bnnScbNvGiqgb@moose.rmq.cloudamqp.com/xvjvsrrc'
      // more config ...
    });

    const loggerMiddleware: Middleware = createLoggerMiddleware({
      logger: console.log.bind(console)
    });

    // Middlware is always clientside first brokerside last
    const client: IMessageClient = createMessageClient(
      transformMessageSomehow,
      loggerMiddleware,
      rabbitMiddleware
    );

    // Create consumer and producer
    const consumer: IConsumer = client.createConsumer();
    const producer: IProducer = client.createProducer();

    // Get messages as an RxJS stream
    const messageStream: Observable<IMessage> = consumer.messageStream();
    messageStream.subscribe(
      ({ payload }) => console.log(`Just recieved ${payload}`),
      console.error
    );

    // Messages have a payload and can contain a number of dynamic metadata keys
    const dest: IDestination = {
      via: 'my-exchange',
      to: 'my-destination-consumer'
    };
    await producer.publish({ dest, payload: 'foo', meta: { ding: 'pop' } });
    await producer.publish({ dest, payload: 'bar' });
    await producer.publish({ dest, payload: { baz: 'baz' } }); // can be object that will be serialised

    await producer.destroy(); // Free up memory
  } catch (err) {
    console.error(err);
  }

  setTimeout(() => {
    consumer.destroy();
  }, 3000);
})();
```

## References

https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
