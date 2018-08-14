import { from } from 'rxjs';
import { Middleware } from '../../types';

import getMockedConnector from '../../../test/helpers/getMockConnector';

import { IAmqpEngineTest, IAmqpMessageIn } from './types';
describe('when I recieve messages from AMQP', () => {
  let channel: IAmqpEngineTest;
  let middewareReceiver: Middleware<IAmqpMessageIn>;

  beforeEach(() => {
    const { createAmqpConnector, channel: engine } = getMockedConnector();

    channel = engine;

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
