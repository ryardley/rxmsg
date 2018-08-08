import { createConsumer, createProducer } from '../index';
import { createInjectableAmqpConnector } from '../middleware/amqp';
import { IAmqpEngine } from '../middleware/amqp/types';
import { jestSpyObject } from './jestSpyObject';
import { getMockEngine } from './mockEngine';

describe('when the message arrives', () => {
  it('should run the hello world example ', done => {
    const channel = jestSpyObject<IAmqpEngine>(getMockEngine());
    const createAmqpConnector = createInjectableAmqpConnector(() => () => {
      return Promise.resolve(channel);
    });

    const { sender, receiver } = createAmqpConnector({
      declarations: {
        queues: [
          {
            durable: false,
            name: 'hello'
          }
        ]
      },
      uri: ''
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
      // Check consume()
      expect(channel.jestSpyCalls.mock.calls).toEqual([
        ['assertQueue', 'hello', { durable: false }],
        ['assertQueue', 'hello', { durable: false }],
        ['consume', 'hello', '_FUNCTION_', { noAck: true }],
        ['publish', '', 'hello', Buffer.from(JSON.stringify('Hello World!'))]
      ]);

      // Check msg.content
      expect(msg.content).toEqual('Hello World!');
      done();
    });
  });
});
