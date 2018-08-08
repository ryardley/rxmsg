// tslint:disable:no-console
import { createConsumer, createProducer } from '..';
import createAmqpConnector from '../middleware/amqp';
import { IAmqpMessageOut } from '../middleware/amqp/types';

it('should simulate work queues', () => {
  const { sender, receiver } = createAmqpConnector({
    declarations: {
      queues: [
        {
          durable: true,
          name: 'task_queue'
        }
      ]
    },
    uri:
      'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
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

  const output = [];
  consumer.subscribe(msg => {
    const secs = msg.content.split('.').length - 1;

    output.push(`Received ${msg.content}`);
    setTimeout(() => {
      output.push('Done');
      msg.ack();
      expect(output).toEqual(['Received Hello World!', 'Done']);
    }, secs * 1000);
  });
});
