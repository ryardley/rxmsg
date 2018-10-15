// import { closeConnection } from './createChannel';
import { AmqpEngineFactory } from './types';

export default (engineFactory: AmqpEngineFactory) => async () => {
  const engine = await engineFactory();
  return await engine.closeConnection();
};
