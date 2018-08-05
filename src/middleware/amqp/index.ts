import { closeConnection } from './createChannel';
import createReceiver from './createReceiver';
import createSender from './createSender';
import { IRabbitConfig } from './domain';

export default (c?: IRabbitConfig) => {
  return {
    close: () => closeConnection(c),
    receiver: createReceiver(c),
    sender: createSender(c)
  };
};
