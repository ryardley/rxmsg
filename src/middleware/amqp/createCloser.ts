// import { closeConnection } from './createChannel';
import { IAmqpEngineFactory } from './types';

export default (engineFactory: IAmqpEngineFactory) => async () => {
  const engine = await engineFactory();
  return await engine.closeConnection();
};
