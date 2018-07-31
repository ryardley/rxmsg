import { Observable, Subject } from 'rxjs';

export interface IConfigObject {
  [key: string]: string | boolean | number | IConfigObject;
}

export interface IMessage {
  payload: any;
  meta?: { [key: string]: any };
  dest?: {
    via?: string;
    to: string;
  };
}

export type MiddlewareCreator<T> = (c: T | void) => Middleware;

export type Producer = Subject<IMessage>;
export type Consumer = Observable<IMessage>;

export type Middleware = (a: Observable<IMessage>) => Observable<IMessage>;
