# blockbid-messaging

This library makes it easy to send messages in a distributed network transparent
way via various brokers including RabbitMQ, Direct Websocket (YTBI) and Kafka (YTBI).

```javascript
// TODO: These are rough declarations
type DestinationType = {
  via: string,
  to: string,
}

type MessageType = {
  payload: *,
  destination: DestinationType,
}

interface IConsumer = {
  getMessageStream(*): Rx.Observable;
}

interface IProducer = {
  publish(msg:MessageType):Promise;
}

interface IMessageMiddleware = IConsumer & IProducer;
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
    const messageClient = createMessageClient(
      loggerMiddleware,
      rabbitMiddleware
    );

    const consumer = messageClient.createConsumer();
    const producer = messageClient.createProducer();

    // Get the messages
    const messageStream = consumer.getMessageStream();

    messageStream.subscribe(({payload}) => console.log(`Just recieved ${payload}`), console.error);

    // Messages have a payload and can contain a number of dynamic metadata keys
    const dest = {via: 'my-exchange', to: 'my-destination-consumer'};
    await producer.publish({ dest, payload: 'foo', meta: { ding:'pop' } });
    await producer.publish({ dest, payload: 'bar' });
    await producer.publish({ dest, payload: {baz:'baz'} }); // can be object

    await producer.destroy(); // Free up memory
  } catch(err) {
    console.error(err);
  }

  setTimeout(() => {
    messageStream.unsubscribe();
  }, 3000);
})();
```

For maintainability we will use a functional middleware pattern.

References

https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
