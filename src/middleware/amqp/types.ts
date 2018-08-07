import { IMessage } from '../../types';

export interface IAmqpQueueFull {
  name: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: any;
}

export type IAmqpQueue = IAmqpQueueFull | string;

export interface IAmqpExchange {
  name: string;
  type: 'fanout' | 'topic' | 'direct';
  durable?: boolean;
  internal?: boolean;
  autoDelete?: boolean;
  alternateExchange?: string;
  arguments?: any;
}

export interface IAmqpReceiver {
  queue?: string; // default to '' <- anon
  consumerTag?: string; // best to ignore this as given automatically
  noAck?: boolean; // if true will dequeue messages as soon as they have been sent
  exclusive?: boolean; // wont let anyone else consume this queue,
  priority?: number;
  arguments?: object;
  prefetch?: number;
  bindings?: IAmqpBinding[];
}

export interface IAmqpConnection {
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
  queues?: IAmqpQueue[]; // queues can be represented as strings
  exchanges?: IAmqpExchange[];
  bindings?: IAmqpBinding[];
}

export type IAmqpConfig = IAmqpConnection & {
  declarations?: IAmqpDeclarations;
};

// Destination information
// For reference Kafka client might have things like:
//   topic, partitionKey, partition
export type IAmqpRoute =
  | {
      exchange: string;
      key?: string;
    }
  | string;

export interface IAmqpMessage extends IMessage {
  route?: IAmqpRoute;
  meta?: {
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
  };
}

export interface IAmqpMessageProducer extends IAmqpMessage {
  mandatory?: true;
  bcc?: string | string[];
  immediate?: boolean;
}

export interface IAmqpMessageConsumed extends IAmqpMessage {
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
