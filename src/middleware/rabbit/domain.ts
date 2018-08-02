import { ConfiguredMiddlewareCreator, IMessage } from '../../domain';

export interface IRabbitQueue {
  name: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: any;
}

export interface IRabbitConsumer {
  queue: string | IRabbitQueue;
  consumerTag?: string; // best to ignore this as given automatically
  // noLocal: boolean; // ignored
  noAck?: boolean; // if true will dequeue messages as soon as they have been sent
  exclusive?: boolean; // wont let anyone else consume this queue,
  priority?: number;
  arguments?: object;
}

// Destination information
// For reference Kafka client might have things like: topic, partitionKey, partition
export interface IRabbitDestination {
  exchange: string;
  routeKey: string;
}

export interface IRabbitMessage extends IMessage {
  destination: IRabbitDestination | string;
  metadata?: {
    // Message metadata will differ based onclient
    expiration?: string;
    userId?: string;
    persistent?: boolean;
    cc?: string | string[];
    priority?: number;
    // deliveryMode: boolean; // deprecate
    // used by rabbit not sent to consumers
    mandatory?: true;
    bcc?: string | string[];
    immediate?: boolean;
    // ignored by rabbit but used by other apps
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

export interface IRabbitReturnMessage extends IMessage {
  ack: () => void;
}

export interface IRabbitExchange {
  name: string;
  type: 'fanout' | 'topic' | 'direct';
  durable?: boolean;
  internal?: boolean;
  autoDelete?: boolean;
  alternateExchange?: string;
  arguments?: any;
}

export interface IRabbitBinding {
  arguments?: any;
  destination: IRabbitQueue | IRabbitExchange | string;
  pattern: string;
  source: IRabbitExchange | string;
  type: 'exchange' | 'queue';
}

export interface IRabbitConnectionConfig {
  uri: string;
  socketOptions?: {
    noDelay?: boolean;
    cert?: Buffer;
    key?: Buffer;
    passphrase?: string;
    ca?: Buffer[];
  };
}

export interface IRabbitConfig extends IRabbitConnectionConfig {
  declarations?: IRabbitStructure;
}

export interface IRabbitStructure {
  queues?: Array<IRabbitQueue | string>;
  exchanges?: IRabbitExchange[];
  bindings?: IRabbitBinding[];
}

export type RabbitConsumerMiddlewareCreator = ConfiguredMiddlewareCreator<
  IRabbitConfig,
  IRabbitConsumer
>;
