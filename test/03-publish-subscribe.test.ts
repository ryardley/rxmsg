// tslint:disable:no-console
import { createConsumer, createProducer } from '../src';
import getMockConnector from './helpers/getMockConnector';

it('should be able to run a fanout exchange', done => {
  const { createAmqpConnector, channel: engine } = getMockConnector();

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
    uri: 'amqp://somerabbitserver'
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
    expect(engine.jestSpyCalls.mock.calls).toEqual([
      ['assertExchange', 'logs', 'fanout', { durable: false }],
      ['assertExchange', 'logs', 'fanout', { durable: false }],
      ['assertQueue', '', { exclusive: true }],
      ['bindQueue', 'server-queue', 'logs', '', undefined],
      ['consume', 'server-queue', '_FUNCTION_', { noAck: true }],
      ['publish', 'logs', '', Buffer.from('"Hello World!"')]
    ]);
    expect(msg.body).toEqual('Hello World!');
    done();
  });

  const producer = createProducer(sender());

  producer.next({
    body: 'Hello World!',
    to: { exchange: 'logs' }
  });
});
