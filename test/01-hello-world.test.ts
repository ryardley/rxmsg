import { createConsumer, createProducer } from '../src';
import getMockConnector from './helpers/getMockConnector';

describe('when the message arrives', () => {
  it('should run the hello world example ', done => {
    const { createAmqpConnector, channel } = getMockConnector();
    const { sender, receiver } = createAmqpConnector({
      declarations: {
        queues: [
          {
            durable: false,
            name: 'hello'
          }
        ]
      },
      uri: 'amqp://somerabbitserver'
    });

    const producer = createProducer(sender());

    producer.next({
      body: 'Hello World!',
      to: 'hello'
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
      expect(msg.body).toEqual('Hello World!');
      done();
    });
  });
});
