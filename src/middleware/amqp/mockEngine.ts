import { IAmqpEngine, IAmqpEngineMessage, IAmqpEngineTest } from './types';

const defaultMockEngine: IAmqpEngine = {
  ack: () => null,
  assertExchange: () => Promise.resolve({ exchange: 'server-exchange' }),
  assertQueue: () => Promise.resolve({ queue: 'server-queue' }),
  bindExchange: () => Promise.resolve({}),
  bindQueue: () => Promise.resolve({}),
  closeConnection: () => Promise.resolve(),
  consume: () => Promise.resolve({}),
  prefetch: () => Promise.resolve({}),
  publish: () => true
};

export interface IMockEngineConfig {
  onPublish?: (a: IPublishBehaviourArgs) => void;
  decorator?: (a: IAmqpEngineTest) => IAmqpEngineTest;
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
}: IMockEngineConfig = {}) {
  let onMessage: MessageCalback;
  let readyCallback: () => void = () => {}; // tslint:disable-line:no-empty
  return decorator({
    ...defaultMockEngine,
    consume: (_, cb) => {
      onMessage = cb; // save callback
      readyCallback();
      return Promise.resolve();
    },
    onReady: callback => (readyCallback = callback),
    publish: (exchange, routingKey, content, opts) => {
      onPublish({ exchange, routingKey, content, opts, onMessage });
      return true;
    }
  });
}
