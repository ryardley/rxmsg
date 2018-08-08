import { IMessage } from '../../types';
// IO Types (Types provided as args at runtime by clients)

export interface IAmqpQueueDescription {
  name: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: any;
}

export type IAmqpQueueShortDescription = IAmqpQueueDescription | string;

export interface IAmqpExchangeDescription {
  name: string;
  type: 'fanout' | 'topic' | 'direct';
  durable?: boolean;
  internal?: boolean;
  autoDelete?: boolean;
  alternateExchange?: string;
  arguments?: any;
}

export interface IAmqpReceiverDescription {
  queue?: string; // default to '' <- anon
  consumerTag?: string; // best to ignore this as given automatically
  noAck?: boolean; // if true will dequeue messages as soon as they have been sent
  exclusive?: boolean; // wont let anyone else consume this queue,
  priority?: number;
  arguments?: object;
  prefetch?: number;
  bindings?: IAmqpBinding[];
}

export interface IAmqpConnectionDescription {
  uri: string;
  socketOptions?: {
    noDelay?: boolean;
    cert?: Buffer;
    key?: Buffer;
    passphrase?: string;
    ca?: Buffer[];
  };
}

export interface IAmqpDeclarations {
  queues?: IAmqpQueueShortDescription[]; // queues can be represented as strings
  exchanges?: IAmqpExchangeDescription[];
  bindings?: IAmqpBinding[];
}

export type IAmqpSystemDescription = IAmqpConnectionDescription & {
  declarations?: IAmqpDeclarations;
};

// Destination information
// For reference Kafka client might have things like:
//   topic, partitionKey, partition
export type IAmqpRouteDescription =
  | {
      exchange: string;
      key?: string;
    }
  | string;

export interface IAmqpMessage extends IMessage {
  route: IAmqpRouteDescription;
  expiration?: string;
  userId?: string;
  persistent?: boolean;
  cc?: string | string[];
  priority?: number;

  // following is ignored by rabbit but used by other apps
  contentType?: string;
  contentEncoding?: string;
  headers?: object;
  correlationId?: string;
  replyTo?: string;
  messageId?: string;
  timestamp?: number;
  type?: string;
  appId?: string;
}

export interface IAmqpMessageOut extends IAmqpMessage {
  mandatory?: true;
  bcc?: string | string[];
  immediate?: boolean;
}

export interface IAmqpMessageIn extends IAmqpMessage {
  ack?: () => void;
  route: {
    exchange: string;
    key?: string;
  };
}

export interface IAmqpBinding {
  arguments?: any;
  destination?: string; // if not provided default to anon queue if no anon que then error
  pattern?: string; // ''
  source: string;
  type?: 'exchange' | 'queue'; // default to queue
}

// IAmqpEngine - to act as a wrapper for amqplib
interface IAmqpEngineMessage {
  content: Buffer;
  fields: any;
  properties: any;
}

export type IAmqpEngineFactory = () => Promise<IAmqpEngine>;
export type IAmqpEngineConfigurator = (
  config: IAmqpConnectionDescription
) => IAmqpEngineFactory;

export interface IAmqpEngine {
  closeConnection?: () => Promise<void>;
  assertExchange?(
    exchange: string,
    type: string,
    options?: any
  ): Promise<{ exchange: string }>;
  assertQueue?(queue: string, options?: any): Promise<{ queue: string }>;
  bindQueue?(
    queue: string,
    source: string,
    pattern: string,
    args?: any
  ): Promise<any>;
  bindExchange?(
    destination: string,
    source: string,
    pattern: string,
    args?: any
  ): Promise<any>;
  prefetch?(count: number, global?: boolean): Promise<{}>;
  consume?(
    queue: string,
    onMessage: (msg: IAmqpEngineMessage | null) => any,
    options?: any
  ): Promise<any>;
  ack?(message: IAmqpEngineMessage, allUpTo?: boolean): void;
  publish?(
    exchange: string,
    routingKey: string,
    content: Buffer,
    options?: any
  ): boolean;
}
