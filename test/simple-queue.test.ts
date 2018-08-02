// Integration test

import { createConsumer, createProducer, rabbitMiddleware } from '../src';

const { sender, receiver } = rabbitMiddleware({
  uri:
    'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
});

const producer = createProducer(sender);

const consumer = createConsumer(
  receiver({
    queue: 'things' // default queue to consume on
  })
);

consumer.subscribe(({ content, ack }) => {
  console.log('>>>> Received ' + content); // tslint:disable-line
  ack();
});

producer.next({
  content: 'dingle bop thing lizard'
});
