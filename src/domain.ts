import { Observable } from 'rxjs';

export interface IDestination {
  via: string;
  to: string;
}

export interface IMessage {
  payload: {};
  meta?: {};
  dest?: IDestination;
}

export interface IMessageClient {
  createProducer: () => any;
  createConsumer: () => any;
}

export interface IProducer {
  publish: (a: IMessage) => Promise<void>;
  destroy: () => Promise<{}>;
}

export interface IConsumer {
  messageStream: () => Observable<IMessage>;
  destroy: () => Promise<{}>;
}

export type ProducerMiddleware = (
  a: Observable<IMessage> | void
) => Observable<IMessage>;

export type ConsumerMiddleware = (
  a: Observable<IMessage>
) => Observable<IMessage> | void;

export type Middleware =
  | {
      consumer: ConsumerMiddleware;
      producer: ProducerMiddleware;
    }
  | ConsumerMiddleware
  | ProducerMiddleware;
