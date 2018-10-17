import { Observer, ReplaySubject } from 'rxjs';
import { combineMiddleware } from '../middleware/middleware';
import { IMessage, Middleware } from '../types';

export function createProducer<T extends IMessage>(
  ...middleware: Array<Middleware<T>>
): Observer<T> {
  const subject = new ReplaySubject<T>();
  const middlewareFunction = combineMiddleware(...middleware);
  middlewareFunction(subject.asObservable());
  return subject;
}
