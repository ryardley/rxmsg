// tslint:disable:no-console
import { createAmqpConnector, createConsumer, createProducer } from '../src';

const { sender, receiver } = createAmqpConnector({
  declarations: {
    exchanges: [
      {
        durable: false,
        name: 'logs',
        type: 'fanout'
      }
    ]
  },
  uri:
    'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
});

const consumer = createConsumer(
  receiver({
    bindings: [
      { source: 'logs' } // string is shorthand for above
    ],
    noAck: true,
    queue: ''
  })
);

consumer.subscribe(msg => {
  console.log(' [x] Received %s', msg.content);
});

setTimeout(() => {
  // Need to wait for the consumer to setup all the bindings
  const producer = createProducer(sender());
  console.log('Sending message...');
  producer.next({
    content: 'Hello World!',
    route: { exchange: 'logs' }
  });
}, 1000);
