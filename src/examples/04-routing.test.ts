// tslint:disable:no-console
import { createConsumer, createProducer } from '../index';
import { createInjectableAmqpConnector } from '../middleware/amqp';
import { IAmqpEngine } from '../middleware/amqp/types';
import { jestSpyObject } from './jestSpyObject';
import { getMockEngine } from './mockEngine';

it('should be able to handle routing', done => {
  const engine = jestSpyObject<IAmqpEngine>(
    getMockEngine({
      onPublish: ({ exchange, routingKey, content, onMessage }) => {
        // Simulate rabbit behaviour
        if (routingKey === 'error') {
          onMessage({
            content,
            fields: { exchange, routingKey },
            properties: {}
          });
        }
      }
    })
  );

  const createAmqpConnector = createInjectableAmqpConnector(() => () => {
    return Promise.resolve(engine);
  });

  const { sender, receiver } = createAmqpConnector({
    declarations: {
      exchanges: [
        {
          durable: false,
          name: 'direct_logs',
          type: 'direct'
        }
      ]
    },
    uri: ''
  });

  const producer = createProducer(sender());

  const consumer = createConsumer(
    receiver({
      bindings: ['error'].map(label => ({
        pattern: label,
        source: 'direct_logs'
      })),
      noAck: true
    })
  );

  consumer.subscribe(msg => {
    expect(engine.jestSpyCalls.mock.calls).toEqual([
      ['assertExchange', 'direct_logs', 'direct', { durable: false }],
      ['assertExchange', 'direct_logs', 'direct', { durable: false }],
      ['assertQueue', '', { exclusive: true }],
      ['bindQueue', 'server-queue', 'direct_logs', 'error', undefined],
      ['consume', 'server-queue', '_FUNCTION_', { noAck: true }],
      ['publish', 'direct_logs', 'warn', Buffer.from('"Hi I am a warning"')],
      ['publish', 'direct_logs', 'error', Buffer.from('"Hi I am an error"')]
    ]);
    expect(msg.content).toEqual('Hi I am an error');
    done();
  });

  producer.next({
    content: 'Hi I am a warning',
    route: { exchange: 'direct_logs', key: 'warn' }
  });

  producer.next({
    content: 'Hi I am an error',
    route: { exchange: 'direct_logs', key: 'error' }
  });
});
