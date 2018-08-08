import { IAmqpEngine, IAmqpEngineMessage } from '../middleware/amqp/types';

const defaultMockEngine: IAmqpEngine = {
  ack: () => null,
  assertExchange: () => Promise.resolve({ exchange: 'dummyexchange' }),
  assertQueue: () => Promise.resolve({ queue: 'dummyqueue' }),
  bindExchange: () => Promise.resolve({}),
  bindQueue: () => Promise.resolve({}),
  closeConnection: () => Promise.resolve(),
  consume: () => Promise.resolve({}),
  prefetch: () => Promise.resolve({}),
  publish: () => true
};

interface IMockEngineConfig {
  onPublish?: (a: IPublishBehaviourArgs) => void;
  decorator?: (a: IAmqpEngine) => IAmqpEngine;
}

type MessageCalback = (m: IAmqpEngineMessage) => void;

interface IPublishBehaviourArgs {
  exchange: string;
  routingKey: string;
  content: Buffer;
  opts: any;
  onMessage: MessageCalback;
}

const defaultPublishBehaviour = ({
  exchange,
  routingKey,
  content,
  onMessage
}: IPublishBehaviourArgs) => {
  setTimeout(() => {
    // ensure a delay this will never be synchronous
    onMessage({ content, fields: { exchange, routingKey }, properties: {} });
  }, 10);
};

export function getMockEngine({
  onPublish = defaultPublishBehaviour,
  decorator = a => a
}: IMockEngineConfig) {
  let onMessage: MessageCalback;
  return decorator({
    ...defaultMockEngine,
    consume: (_, cb) => {
      onMessage = cb; // save callback
      return Promise.resolve();
    },
    publish: (exchange, routingKey, content, opts) => {
      onPublish({ exchange, routingKey, content, opts, onMessage });
      return true;
    }
  });
}
