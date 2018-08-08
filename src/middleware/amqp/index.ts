import { configureAmqpEngine } from './amqpEngine';
import createCloser from './createCloser';
import createReceiver from './createReceiver';
import createSender from './createSender';

import { IAmqpEngineConfigurator, IAmqpSystemDescription } from './types';

export const createInjectableAmqpConnector = (
  configureEngine: IAmqpEngineConfigurator
) => (config: IAmqpSystemDescription) => {
  const amqpFactory = configureEngine(config);
  const { declarations = {} } = config;

  const close = createCloser(amqpFactory);
  const receiver = createReceiver(amqpFactory, declarations);
  const sender = createSender(amqpFactory, declarations);

  return {
    close,
    receiver,
    sender
  };
};

export default createInjectableAmqpConnector(configureAmqpEngine);
