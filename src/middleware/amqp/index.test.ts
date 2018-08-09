import { from } from 'rxjs';
import { jestSpyObject } from '../../../test/jestSpyObject';
import { Middleware } from '../../types';
import { createInjectableAmqpConnector } from './index';
import { getMockEngine } from './mockEngine';
import { IAmqpEngineTest, IAmqpMessageIn } from './types';
describe('when I recieve messages from AMQP', () => {
  let channel: IAmqpEngineTest;
  let middewareReceiver: Middleware<IAmqpMessageIn>;

  beforeEach(() => {
    channel = jestSpyObject<IAmqpEngineTest>(getMockEngine());
    const createAmqpConnector = createInjectableAmqpConnector(() => () => {
      return Promise.resolve(channel);
    });

    const { receiver } = createAmqpConnector({
      declarations: {
        queues: [
          {
            durable: false,
            name: 'hello'
          }
        ]
      },
      uri: ''
    });

    middewareReceiver = receiver({
      queue: 'hello'
    });
  });

  it('should deserialise messages that are JSON', done => {
    const m = { is: 'a', nested: { cat: 'bird' } };
    const jsonMessage = JSON.stringify(m);
    channel.onReady(() => {
      channel.publish('', 'hello', Buffer.from(jsonMessage));
    });

    middewareReceiver(from([])).subscribe(msg => {
      expect(msg.content).toEqual(m);
      done();
    });
  });

  it('should not blow up when receiving messages that cannot be parsed as JSON', done => {
    channel.onReady(() => {
      channel.publish('', 'hello', Buffer.from('Foo'));
    });

    middewareReceiver(from([])).subscribe(msg => {
      expect(msg.content).toEqual('Foo');
      done();
    });
  });
});
