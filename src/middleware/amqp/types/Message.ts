import { IMessage } from '../../../types';

export type RouteDescription =
  | {
      exchange: string;
      key?: string;
    }
  | string;

export type AmqpMessage = IMessage & {
  route: RouteDescription;
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

export type AmqpMessageOut = AmqpMessage & {
  mandatory?: true;
  bcc?: string | string[];
  immediate?: boolean;
};

export type AmqpMessageIn = AmqpMessage & {
  ack: () => void;
  route: {
    exchange: string;
    key?: string;
  };
};
