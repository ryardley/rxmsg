import { Observable, Subject } from 'rxjs';

export interface IDestination {
  via?: string;
  to: string;
}

export interface IMessage {
  payload: {};
  meta?: { [key: string]: any };
  dest?: IDestination;
  [key: string]: any;
}

export type Producer = Subject<IMessage>;
export type Consumer = Observable<IMessage>;

export type Middleware = (a: Observable<IMessage>) => Observable<IMessage>;
