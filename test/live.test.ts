import { createConsumer, createProducer } from '../src';
import createAmqpConnector from '../src/middleware/amqp';

describe('when the message arrives', () => {
  it(
    'should run the hello world example with a live rabbit MQ',
    done => {
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

      consumer.subscribe(msg => {
        // Check msg.content
        expect(msg.content).toEqual('Hello World!');
        done();
      });
    },
    7000
  );
});
