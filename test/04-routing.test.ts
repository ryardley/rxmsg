// tslint:disable:no-console
import { createConsumer, createProducer } from '../src';

import getMockConnector from './helpers/getMockConnector';

it('should be able to handle routing', done => {
  const { createAmqpConnector, channel: engine } = getMockConnector({
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
    uri: 'amqp://somerabbitserver'
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
    expect(msg.body).toEqual('Hi I am an error');
    done();
  });

  producer.next({
    body: 'Hi I am a warning',
    to: { exchange: 'direct_logs', key: 'warn' }
  });

  producer.next({
    body: 'Hi I am an error',
    to: { exchange: 'direct_logs', key: 'error' }
  });
});
