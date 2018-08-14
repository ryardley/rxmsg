// tslint:disable:no-console
import { createConsumer, createProducer } from '../src';
import { IAmqpMessageOut } from '../src/middleware/amqp/types';
import getMockConnector from './helpers/getMockConnector';

it('should simulate work queues', done => {
  const { createAmqpConnector, channel: engine } = getMockConnector();

  const { sender, receiver } = createAmqpConnector({
    declarations: {
      queues: [
        {
          durable: true,
          name: 'task_queue'
        }
      ]
    },
    uri: ''
  });

  const producer = createProducer<IAmqpMessageOut>(sender());

  producer.next({
    content: 'Hello World!',
    persistent: true,
    route: 'task_queue'
  });

  const consumer = createConsumer(
    receiver({
      prefetch: 1,
      queue: 'task_queue'
    })
  );

  const output: any[] = [];
  consumer.subscribe(msg => {
    const secs = msg.content.split('.').length - 1;

    output.push(`Received ${msg.content}`);
    expect(msg.content).toEqual('Hello World!');

    setTimeout(() => {
      output.push('Done');
      msg.ack();

      expect(engine.jestSpyCalls.mock.calls).toEqual([
        ['assertQueue', 'task_queue', { durable: true }],
        ['assertQueue', 'task_queue', { durable: true }],
        ['prefetch', 1],
        ['consume', 'task_queue', '_FUNCTION_', {}],
        [
          'publish',
          '',
          'task_queue',
          Buffer.from(JSON.stringify('Hello World!'))
        ],
        [
          'ack',
          {
            content: Buffer.from(JSON.stringify('Hello World!')),
            fields: { exchange: '', routingKey: 'task_queue' },
            properties: {}
          },
          false
        ]
      ]);
      done();
    }, secs * 1000);
  });
});
