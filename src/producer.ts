import { ReplaySubject } from 'rxjs';
import { combineMiddleware } from './middleware';
import { IMessage, Middleware } from './types';

export const createProducer = (...middleware: Middleware[]) => {
  const subject = new ReplaySubject<IMessage>();
  const middlewareFunction = combineMiddleware(...middleware);
  middlewareFunction(subject.asObservable());
  return subject;
};
