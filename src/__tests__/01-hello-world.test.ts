import { createConsumer, createProducer } from '../index';
import { createInjectableAmqpConnector } from '../middleware/amqp';
import mockEngine from '../middleware/amqp/mockEngine';

function getMockEngine() {
  let onMessage: (a: { content: Buffer; fields: any }) => void;
  return {
    ...mockEngine,
    consume: (queue, cb, opts) => {
      onMessage = cb; // save callback
      return Promise.resolve();
    },
    publish: (exchange, routingKey, content, opts) => {
      onMessage({ content, fields: { exchange, routingKey } });
      return true;
    }
  };
}

it('should run the hello world example', done => {
  const engine = getMockEngine();
  const createAmqpConnector = createInjectableAmqpConnector(() => () => {
    return Promise.resolve(engine);
  });

  const { sender, receiver } = createAmqpConnector({
    declarations: {
      queues: [
        {
          durable: false,
          name: 'hello'
        }
      ]
    },
    uri:
      'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
  });

  const producer = createProducer(sender());

  producer.next({
    content: 'Hello World!',
    route: 'hello'
  });

  const consumer = createConsumer(
    receiver({
      noAck: true,
      queue: 'hello'
    })
  );

  const sub = consumer.subscribe(msg => {
    sub.unsubscribe();
    setTimeout(() => {
      expect(msg.content).toEqual('Hello World!');
      done();
    });
  });
});
