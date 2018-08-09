// tslint:disable:no-console
import { createConsumer, createProducer } from '..';
import { jestSpyObject } from '../../test/jestSpyObject';
import { createInjectableAmqpConnector } from '../middleware/amqp';
import { getMockEngine } from '../middleware/amqp/mockEngine';
import { IAmqpEngine, IAmqpMessageOut } from '../middleware/amqp/types';

it('should simulate work queues', done => {
  const engine = jestSpyObject<IAmqpEngine>(getMockEngine());

  const createAmqpConnector = createInjectableAmqpConnector(() => () => {
    return Promise.resolve(engine);
  });

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
