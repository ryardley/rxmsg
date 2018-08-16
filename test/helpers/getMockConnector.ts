import { createInjectableAmqpConnector } from '../../src/middleware/amqp';
import {
  getMockEngine,
  MockEngineConfig
} from '../../src/middleware/amqp/mockEngine';
import { AmqpTestEngine } from '../../src/middleware/amqp/types';
import { jestSpyObject } from './jestSpyObject';

export default function getMockedConnector(config?: MockEngineConfig) {
  const channel = jestSpyObject<AmqpTestEngine>(getMockEngine(config));
  const createAmqpConnector = createInjectableAmqpConnector(() => setup =>
    setup ? setup(channel) : Promise.resolve(channel)
  );
  return { channel, createAmqpConnector };
}
