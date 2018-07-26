import { Observable } from 'rxjs';

export interface IDestination {
  via: string;
  to: string;
}

export interface IMessage {
  payload: any;
  meta?: any;
  dest?: IDestination;
}

export type ProducerMiddleware = (
  a: Observable<IMessage> | undefined
) => Observable<IMessage>;

export type ConsumerMiddleware = (
  a: Observable<IMessage>
) => Observable<IMessage> | undefined;

export type Middleware =
  | {
      consumer: ConsumerMiddleware;
      producer: ProducerMiddleware;
    }
  | ConsumerMiddleware
  | ProducerMiddleware;
