import { Observable } from 'rxjs';

// Generic message
export interface IMessage {
  content: any;
  route?: any;
  meta?: any;
}

// Generic Middleware decorates a stream
export type Middleware<T> = (a: Observable<T>) => Observable<T>;
