// tslint:disable:no-console
import { createConsumer, createProducer } from '../src';
import { createInjectableAmqpConnector } from '../src/middleware/amqp';
import { getMockEngine } from '../src/middleware/amqp/mockEngine';
import { IAmqpEngine } from '../src/middleware/amqp/types';
import { jestSpyObject } from './jestSpyObject';

it('should be able to run a fanout exchange', done => {
  const engine = jestSpyObject<IAmqpEngine>(getMockEngine());

  const createAmqpConnector = createInjectableAmqpConnector(() => () => {
    return Promise.resolve(engine);
  });

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
    uri: ''
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
    expect(msg.content).toEqual('Hello World!');
    done();
  });

  const producer = createProducer(sender());

  producer.next({
    content: 'Hello World!',
    route: { exchange: 'logs' }
  });
});
