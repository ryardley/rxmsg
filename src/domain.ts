import { Observable, Subject } from 'rxjs';

export interface IRabbitDestination {
  exchange?: string;
  queue?: string;
}

export interface IMessage {
  payload: any;
  ack?: () => void;
  meta?: { [key: string]: any };
  dest?: IRabbitDestination;
}

export type MiddlewareCreator<T> = (c: T) => Middleware;

export type Producer = Subject<IMessage>;
export type Consumer = Observable<IMessage>;

export type Middleware = (a: Observable<IMessage>) => Observable<IMessage>;
