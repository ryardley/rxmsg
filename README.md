# blockbid-messaging

This library makes it easy to send messages in a distributed network transparent
way via various brokers including RabbitMQ. At a later point it should be able
to work locally through spawned processes, via a direct Websocket (YTBI) and Kafka (YTBI).

- Modular middleware system inspired by Redux and Express
- Favour higher order functional configuration over classes inheritence and DI

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

type MessageConsumer = {
  getMessageStream: () => Rx.Observable
};

type MessageProducer = {
  publish: (msg: Message) => Promise
};

type MessagePlugin = Consumer & Producer;
```

```javascript
import {
  // Plugins
  createLoggerMiddleware,
  createRabbitMiddleware,

  // Core
  createMessageClient
} from 'blockbid-messaging';

(async () => {
  try {

    const rabbitMiddleware = createRabbitMiddleware({
      uri: 'amqp://xvjvsrrc:VbuL1atClKt7zVNQha0bnnScbNvGiqgb@moose.rmq.cloudamqp.com/xvjvsrrc';
    });

    const loggerMiddleware = createLoggerMiddleware({
      logger: console.log.bind(console)
    });

    // Middlware is always client layer first broker layer last
    const {createConsumer, createProducer} = createMessageClient(
      loggerMiddleware,
      rabbitMiddleware
    );

    // Create consumer and producer
    const consumer = createConsumer();
    const producer = createProducer();

    // Get messages as an RxJS stream
    const messageStream = consumer.getMessageStream();

    messageStream.subscribe(({payload}) => console.log(`Just recieved ${payload}`), console.error);

    // Messages have a payload and can contain a number of dynamic metadata keys
    const dest = {via: 'my-exchange', to: 'my-destination-consumer'};
    await producer.publish({ dest, payload: 'foo', meta: { ding:'pop' } });
    await producer.publish({ dest, payload: 'bar' });
    await producer.publish({ dest, payload: {baz:'baz'} }); // can be object that will be serialised

    await producer.destroy(); // Free up memory
  } catch(err) {
    console.error(err);
  }

  setTimeout(() => {
    messageStream.unsubscribe();
  }, 3000);
})();
```

References

https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
