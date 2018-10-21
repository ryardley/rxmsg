import { Observable } from 'rxjs';

// Generic message
export interface IMessage {
  body: any;
  to: any;
  correlationId?: string;
  replyTo?: string;
}

// Generic Middleware decorates a stream
export type Middleware<T extends IMessage> = (
  a: Observable<T>
) => Observable<T>;
