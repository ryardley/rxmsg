import { from } from 'rxjs';
import { combineMiddleware } from './middleware';
import { Middleware } from './types';

export const createConsumer = (...middleware: Middleware[]) => {
  const nullObservable = from([]);
  const middlewareFunction = combineMiddleware(...middleware);
  return middlewareFunction(nullObservable);
};
