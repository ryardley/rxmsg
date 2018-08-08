import { IAmqpEngine } from '../amqp/types';

const mockEngine: IAmqpEngine = {
  ack: () => null,
  assertExchange: () => Promise.resolve({ exchange: 'dummyexchange' }),
  assertQueue: () => Promise.resolve({ queue: 'dummyqueue' }),
  bindExchange: () => Promise.resolve({}),
  bindQueue: () => Promise.resolve({}),
  closeConnection: () => Promise.resolve(),
  consume: () => Promise.resolve({}),
  prefetch: () => Promise.resolve({}),
  publish: () => true
};

export default mockEngine;
