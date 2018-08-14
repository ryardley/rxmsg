/* tslint:disable:no-console */
import { createProducer } from '../src';
import createAmqpConnector from '../src/middleware/amqp';

const { sender } = createAmqpConnector({
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

const producer = createProducer(sender());

setInterval(() => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  console.log(`Sending: (${hex}) "Hello World!"`);
  producer.next({
    content: `(${hex}) Hello World!`,
    route: 'hello'
  });
}, 2000);
