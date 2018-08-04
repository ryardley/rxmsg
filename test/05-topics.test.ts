// tslint:disable:no-console
import { createAmqpConnector, createConsumer, createProducer } from '../src';
const { sender, receiver } = createAmqpConnector({
  declarations: {
    exchanges: [
      {
        durable: false,
        name: 'topic_logs',
        type: 'topic'
      }
    ]
  },
  uri:
    'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
});

function emitLog(msg = 'Hello World', key = 'anonymous.info') {
  const producer = createProducer(sender());

  producer.next({
    content: msg,
    route: { exchange: 'topic_logs', key }
  });
}

function recieveLog(patterns: string[]) {
  const consumer = createConsumer(
    receiver({
      bindings: patterns.map(pattern => ({ source: 'topic_logs', pattern })),
      noAck: true
    })
  );

  consumer.subscribe(msg => {
    console.log(" [x] %s: '%s'", msg.route.key, msg.content);
  });
}

recieveLog(['*.exe', '*.jpg', 'cat.*']);

setTimeout(() => {
  emitLog('I am a JPG image', 'cat.jpg');
  emitLog('I am a Dog exe', 'dog.exe');
  emitLog('I am a Fish image', 'fish.png');
}, 1000);
