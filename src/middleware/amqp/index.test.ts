import { from } from 'rxjs';
import { Middleware } from '../../types';

import getMockedConnector from '../../../test/helpers/getMockConnector';

import { AmqpMessageIn, AmqpTestEngine } from './types';
describe('when I recieve messages from AMQP', () => {
  let channel: AmqpTestEngine;
  let middewareReceiver: Middleware<AmqpMessageIn>;

  describe('when I have an invalid configuration', () => {
    it('should squak', () => {
      expect(() => {
        const { createAmqpConnector } = getMockedConnector();
        createAmqpConnector({
          declarations: {
            queues: [
              {
                funk: 'foo'
              }
            ]
          }
        });
      }).toThrow();
    });
  });

  describe('when I have a valid configuration', () => {
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
        uri: 'amqp://somerabbitserver'
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
});
