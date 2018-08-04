import { IMessage } from '../../domain';

export interface IRabbitQueueFull {
  name: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: any;
}

export type IRabbitQueue = IRabbitQueueFull | string;

export interface IRabbitExchange {
  name: string;
  type: 'fanout' | 'topic' | 'direct';
  durable?: boolean;
  internal?: boolean;
  autoDelete?: boolean;
  alternateExchange?: string;
  arguments?: any;
}

export interface IRabbitReceiver {
  queue?: string; // default to '' <- anon
  consumerTag?: string; // best to ignore this as given automatically
  noAck?: boolean; // if true will dequeue messages as soon as they have been sent
  exclusive?: boolean; // wont let anyone else consume this queue,
  priority?: number;
  arguments?: object;
  prefetch?: number;
  bindings?: IRabbitBinding[];
}

export interface IRabbitConnection {
  uri: string;
  socketOptions?: {
    noDelay?: boolean;
    cert?: Buffer;
    key?: Buffer;
    passphrase?: string;
    ca?: Buffer[];
  };
}

export interface IRabbitDeclarations {
  queues?: IRabbitQueue[]; // queues can be represented as strings
  exchanges?: IRabbitExchange[];
  bindings?: IRabbitBinding[];
}

export type IRabbitConfig = IRabbitConnection & {
  declarations?: IRabbitDeclarations;
};

// Destination information
// For reference Kafka client might have things like:
//   topic, partitionKey, partition
export type IRabbitRoute =
  | {
      exchange: string;
      key?: string;
    }
  | string;

export interface IRabbitMessage extends IMessage {
  route?: IRabbitRoute;
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

export interface IRabbitMessageProducer extends IRabbitMessage {
  mandatory?: true;
  bcc?: string | string[];
  immediate?: boolean;
}

export interface IRabbitMessageConsumed extends IRabbitMessage {
  ack?: () => void;
  route: {
    exchange: string;
    key?: string;
  };
}

export interface IRabbitBinding {
  arguments?: any;
  destination?: string; // if not provided default to anon queue if no anon que then error
  pattern?: string; // ''
  source: string;
  type?: 'exchange' | 'queue'; // default to queue
}

//////////////
// FUCTIONS //
//////////////

// Function to take a queue and assert it
// export type RabbitQueueAsserter = (
//   channel: Channel,
//   c: IRabbitQueue
// ) => Replies.AssertQueue;

// this seems pretty implemetation heavy might be better closer to functions
// export type RabbitConsumerMiddlewareCreator = ConfiguredMiddlewareCreator<
//   IRabbitConfig,
//   IRabbitConsumer
// >;
