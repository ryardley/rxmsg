import { Observable, Subject } from 'rxjs';

export interface IMessage {
  content: any;
  route?: any;
  ack?: () => void;
}

export type MiddlewareCreator<T> = (c: T) => Middleware;
export type ConfiguredMiddlewareCreator<T, Q> = (c: T) => MiddlewareCreator<Q>;
export type Producer = Subject<IMessage>;
export type Consumer = Observable<IMessage>;

export type Middleware = (a: Observable<IMessage>) => Observable<IMessage>;
