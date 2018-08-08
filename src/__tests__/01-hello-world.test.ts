import * as amqplib from 'amqplib';
import { createConsumer, createProducer } from '../index';
import { createInjectableAmqpConnector } from '../middleware/amqp';

it('should run the hello world example', done => {
  const createAmqpConnector = createInjectableAmqpConnector(amqplib);
  const { sender, receiver } = createAmqpConnector({
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

  producer.next({
    content: 'Hello World!',
    route: 'hello'
  });

  const consumer = createConsumer(
    receiver({
      noAck: true,
      queue: 'hello'
    })
  );

  const sub = consumer.subscribe(msg => {
    sub.unsubscribe();
    setTimeout(() => {
      expect(msg.content).toEqual('Hello World!');
      done();
    });
  });
});
