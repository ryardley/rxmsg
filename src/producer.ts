import { Subject } from 'rxjs';
import { IMessage, Middleware } from './domain';
import { combineMiddleware } from './middleware';

export const createProducer = (...middleware: Middleware[]) => () => {
  const subject = new Subject<IMessage>();
  const middlewareFunction = combineMiddleware(...middleware);
  middlewareFunction(subject.asObservable());
  return subject;
};
