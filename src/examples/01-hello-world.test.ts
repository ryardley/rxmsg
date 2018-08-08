import { createConsumer, createProducer } from '../index';
import { createInjectableAmqpConnector } from '../middleware/amqp';
import { IAmqpEngine } from '../middleware/amqp/types';
import { getMockEngine } from './mockEngine';

describe('when the message arrives', () => {
  const engine = getMockEngine({
    decorator: (mockEngine: IAmqpEngine) => ({
      ...mockEngine,
      assertQueue: jest.fn(mockEngine.assertQueue),
      consume: jest.fn(mockEngine.consume),
      publish: jest.fn(mockEngine.publish)
    })
  });

  it('should run the hello world example ', done => {
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

    consumer.subscribe(msg => {
      // Check consume()
      expect((engine.consume as jest.Mock).mock.calls[0][0]).toEqual('hello');
      expect((engine.consume as jest.Mock).mock.calls[0][2]).toEqual({
        noAck: true
      });

      // Check assertQueue()
      expect(engine.assertQueue).toHaveBeenCalledWith('hello', {
        durable: false
      });

      // Check publish()
      expect(engine.publish).toHaveBeenCalledWith(
        '',
        'hello',
        Buffer.from(JSON.stringify('Hello World!'))
      );

      // Check msg.content
      expect(msg.content).toEqual('Hello World!');
      done();
    });
  });
});
