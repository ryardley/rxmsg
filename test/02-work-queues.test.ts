// tslint:disable:no-console
import { ReplaySubject } from 'rxjs';
import { createAmqpConnector, createConsumer, createProducer } from '../src';
import { IRabbitMessageProducer } from '../src/middleware/rabbit/domain';

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

const producer: ReplaySubject<IRabbitMessageProducer> = createProducer(
  sender()
);

producer.next({
  content: 'Hello World!',
  meta: {
    persistent: true
  },
  route: 'task_queue'
});

const consumer = createConsumer(
  receiver({
    prefetch: 1,
    queue: 'task_queue'
  })
);

consumer.subscribe(msg => {
  const secs = msg.content.split('.').length - 1;

  console.log(' [x] Received %s', msg.content);
  setTimeout(() => {
    console.log(' [x] Done');
    msg.ack();
  }, secs * 1000);
});
