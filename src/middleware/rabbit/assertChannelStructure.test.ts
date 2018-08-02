import { Channel } from 'amqplib';
import assertChannelStructure from './assertChannelStructure';
import { IRabbitBinding, IRabbitExchange } from './domain';

describe('assertChannelStructure()', () => {
  const mockChannel = ({
    assertExchange: jest.fn(() => Promise.resolve()),
    assertQueue: jest.fn(() => Promise.resolve()),
    bindExchange: jest.fn(() => Promise.resolve()),
    bindQueue: jest.fn(() => Promise.resolve())
  } as any) as Channel;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not sqwak when given nothing.', () => {
    expect(() => assertChannelStructure(mockChannel, {})).not.toThrow();
  });

  describe('when passed a queue structure', () => {
    const structure = {
      bindings: [
        {
          destination: 'queue1',
          source: 'exchange1',
          type: 'queue'
        } as IRabbitBinding
      ],
      exchanges: [
        {
          durable: true,
          name: 'exchange1',
          type: 'direct'
        } as IRabbitExchange,
        {
          durable: true,
          name: 'exchange2',
          type: 'direct'
        } as IRabbitExchange
      ],
      queues: ['queue1', { name: 'queue2', durable: true }]
    };

    beforeEach(() => {
      assertChannelStructure(mockChannel, structure);
    });

    it('should assert a queue', () => {
      expect(mockChannel.assertQueue).toHaveBeenCalledTimes(2);
      expect(mockChannel.assertQueue).toHaveBeenNthCalledWith(1, 'queue1', {});
      expect(mockChannel.assertQueue).toHaveBeenNthCalledWith(2, 'queue2', {
        durable: true
      });
    });

    it('should assert an exchange', () => {
      expect(mockChannel.assertExchange).toHaveBeenNthCalledWith(
        1,
        'exchange1',
        'direct',
        {
          durable: true
        }
      );
      expect(mockChannel.assertExchange).toHaveBeenNthCalledWith(
        2,
        'exchange2',
        'direct',
        {
          durable: true
        }
      );
    });
  });
});
