import { IMessageClient, Middleware } from './domain';

const nullMessageClient: IMessageClient = {
  createConsumer: () => undefined,
  createProducer: () => undefined
};

export default function createMessageClient(
  ...middleware: Middleware[]
): IMessageClient {
  if (!middleware || middleware.length === 0) {
    throw new Error('No middleware provided to message client.');
  }
  return nullMessageClient;
}
