import { configureAmqpEngine } from './amqpEngine';
import createCloser from './createCloser';
import createReceiver from './createReceiver';
import createSender from './createSender';
import {
  AmqpEngineFactory,
  AmqpSystemDescription,
  AmqpSystemDescriptionSchema,
  ConnectionDescription
} from './types';
import { createValidator } from './types/validator';

export type EngineFactoryCreator = (
  c: ConnectionDescription
) => AmqpEngineFactory;

const validateInput = createValidator<AmqpSystemDescription>(
  AmqpSystemDescriptionSchema
);

export const createInjectableAmqpConnector = (
  createConnectedFactory: EngineFactoryCreator
) => (input: any) => {
  const {
    declarations = {},
    ...connDescription
  }: AmqpSystemDescription = validateInput(input);

  const connectedFactory = createConnectedFactory(connDescription);

  return {
    close: createCloser(connectedFactory),
    receiver: createReceiver(connectedFactory, declarations),
    sender: createSender(connectedFactory, declarations)
  };
};

export default createInjectableAmqpConnector(configureAmqpEngine);
