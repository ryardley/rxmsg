// Integration test

import { createConsumer, createProducer, rabbitMiddleware } from '../src';

const { sender, receiver } = rabbitMiddleware({
  queue: 'thing',
  uri:
    'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
});

const producer = createProducer(sender);
const consumer = createConsumer(receiver);
consumer.subscribe(({ payload, ack }) => {
  console.log('>>>> Received ' + payload); // tslint:disable-line
  ack();
});

producer.next({
  dest: { queue: 'thing' },
  payload: 'dingle bop thing lizard'
});
