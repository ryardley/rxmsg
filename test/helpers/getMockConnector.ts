import { createInjectableAmqpConnector } from '../../src/middleware/amqp';
import {
  getMockEngine,
  IMockEngineConfig
} from '../../src/middleware/amqp/mockEngine';
import { IAmqpEngineTest } from '../../src/middleware/amqp/types';
import { jestSpyObject } from './jestSpyObject';

export default function getMockedConnector(config?: IMockEngineConfig) {
  const channel = jestSpyObject<IAmqpEngineTest>(getMockEngine(config));
  const createAmqpConnector = createInjectableAmqpConnector(() => setup =>
    setup ? setup(channel) : Promise.resolve(channel)
  );
  return { channel, createAmqpConnector };
}
