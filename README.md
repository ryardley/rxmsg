# blockbid-messaging

This library makes it easy to send messages in a distributed network transparent
way via various brokers including RabbitMQ, Direct Websocket (YTBI) and Kafka (YTBI).

```javascript
import {
  createRabbitConnector,
  createBus,
  createConsumer,
  createProducer
} from 'blockbid-messaging';

const connector = createRabbitConnector({
  // options to be merged into config for concrete client
  uri: 'amqp://xvjvsrrc:VbuL1atClKt7zVNQha0bnnScbNvGiqgb@moose.rmq.cloudamqp.com/xvjvsrrc';
});

const broker:MessageBroker = createBroker(connector);

// const consumer = createConsumer({ bus, queue: 'bar' });
// const producer = createProducer({
//   bus,
//   exchange: 'food',
//   routingKey: 'cherries'
// });
const consumer:MessageConsumer = createConsumer(broker, { queue: 'myqueue' });
const producer:MessageProducer = createProducer(broker);



// Here we have a shared() observable so we can filter and map results and listen as many times as required.
consumer.subscribe(msg => {
  console.log(`Just recieved ${msg}`);
});

producer.send('foo');
producer.send('bar');
producer.send('baz');
producer.close();
```
