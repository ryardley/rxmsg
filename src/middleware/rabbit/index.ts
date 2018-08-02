import createReceiver from './createReceiver';
import createSender from './createSender';
import { IRabbitConfig } from './domain';

export default (c?: IRabbitConfig) => ({
  receiver: createReceiver(c),
  sender: createSender(c)
});
