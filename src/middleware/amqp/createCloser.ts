import { closeConnection } from './createChannel';
import { IAmqp, IAmqpConfig } from './types';

export default (amqp: IAmqp) => (config: IAmqpConfig) => () =>
  closeConnection(amqp, config);
