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

```javascript
type Destination = {
  via: string, // exchange or topic
  to: string // address
};

type Message = {
  payload: *,
  dest: Destination,
  meta: *
};

type MiddlewareConsumer = (?Rx.Observable) => Rx.Observable;
type MiddlewareProducer = Rx.Observable => ?Rx.Observable;

type Middleware =
  | { consumer: MiddlewareConsumer, producer: MiddlewareProducer }
  | MiddlewareConsumer
  | MiddlewareProducer;

type MessageProducer = (msg: Message) => Promise;
type MessageConsumer = () => Rx.Observable;
```

```javascript
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
    const rabbitMiddleware = createRabbitMiddleware({
      uri:
        'amqp://xvjvsrrc:VbuL1atClKt7zVNQha0bnnScbNvGiqgb@moose.rmq.cloudamqp.com/xvjvsrrc'
      // more config ...
    });

    const loggerMiddleware = createLoggerMiddleware({
      logger: console.log.bind(console)
    });

    // Middlware is always clientside first brokerside last
    const client = createMessageClient(
      transformMessageSomehow,
      loggerMiddleware,
      rabbitMiddleware
    );

    // Create consumer and producer
    const consumer = client.createConsumer();
    const producer = client.createProducer();

    // Get messages as an RxJS stream
    const messageStream = consumer.messageStream();
    messageStream.subscribe(
      ({ payload }) => console.log(`Just recieved ${payload}`),
      console.error
    );

    // Messages have a payload and can contain a number of dynamic metadata keys
    const dest = { via: 'my-exchange', to: 'my-destination-consumer' };
    await producer.publish({ dest, payload: 'foo', meta: { ding: 'pop' } });
    await producer.publish({ dest, payload: 'bar' });
    await producer.publish({ dest, payload: { baz: 'baz' } }); // can be object that will be serialised

    await producer.destroy(); // Free up memory
  } catch (err) {
    console.error(err);
  }

  setTimeout(() => {
    messageStream.unsubscribe();
  }, 3000);
})();
```

References

https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
