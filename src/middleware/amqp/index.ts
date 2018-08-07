import { closeConnection } from './createChannel';
import createReceiver from './createReceiver';
import createSender from './createSender';
import { IAmqpConfig } from './types';

export default (c?: IAmqpConfig) => {
  return {
    close: () => closeConnection(c),
    receiver: createReceiver(c),
    sender: createSender(c)
  };
};
