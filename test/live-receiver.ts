/* tslint:disable:no-console */
import { createConsumer } from '../src';
import createAmqpConnector from '../src/middleware/amqp';

const { receiver } = createAmqpConnector({
  declarations: {
    queues: [
      {
        durable: false,
        name: 'hello'
      }
    ]
  },
  uri:
    'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
});

const consumer = createConsumer(
  receiver({
    noAck: true,
    queue: 'hello'
  })
);

consumer.subscribe(msg => {
  // Check msg.content
  console.log(`Received: "${msg.content}"`);
});
