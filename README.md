# blockbid-messaging

Wrapper for abstract messaging service used within blockbid.

This should allow us to migrate messaging to an abstract messaging layer.

Initially this will be based on RabbitMQ but should be able at a later date be transposable to Kafka

```javascript
import {
  createRabbitConnector,
  createLocalConnector
} from 'blockbid-messaging';

const rabbitConnector = createRabbitConnector({
  // options to be merged into config for concrete client
});

const foodConnection = createConnection(rabbitConnector).channel('food');

const consumerObservable = foodConnection.createConsumer();
const producerObservable = foodConnection.createProducer();

consumerObservable.subscribe(msg => {
  console.log(`Just recieved ${msg}`);
});

producerObservable.next('foo');
producerObservable.next('bar');
producerObservable.next('baz');
```
