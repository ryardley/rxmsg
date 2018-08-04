// tslint:disable:no-console
import { createAmqpConnector, createConsumer, createProducer } from '../src';
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
  uri:
    'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
});

function runProducer(msg = 'Hello World', severity = 'info') {
  const producer = createProducer(sender());

  producer.next({
    content: msg,
    route: { exchange: 'direct_logs', key: severity }
  });
}

function runConsumer(labels: string[]) {
  const consumer = createConsumer(
    receiver({
      bindings: labels.map(label => ({
        pattern: label,
        source: 'direct_logs'
      })),
      noAck: true
    })
  );

  consumer.subscribe(msg => {
    console.log(" [x] %s: '%s'", msg.route.key, msg.content);
  });
}

runConsumer(['info', 'warn', 'error']);

setTimeout(() => {
  runProducer('Hi I am foo', 'error');
  runProducer('Hi I am a warning', 'warn');
}, 2000);
