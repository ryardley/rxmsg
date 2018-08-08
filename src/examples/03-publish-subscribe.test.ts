// tslint:disable:no-console
import { createConsumer, createProducer } from '../index';
import createAmqpConnector from '../middleware/amqp';

it.skip('should be able to run a fanout exchange', done => {
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
    expect(msg.content).toEqual('Hello World!');
    done();
  });

  setTimeout(() => {
    // Need to wait for the consumer to setup all the bindings
    const producer = createProducer(sender());
    producer.next({
      content: 'Hello World!',
      route: { exchange: 'logs' }
    });
  }, 1000);
});
