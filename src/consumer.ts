import { from } from 'rxjs';
import { Middleware } from './domain';
import { combineMiddleware } from './middleware';

export const createConsumer = (...middleware: Middleware[]) => () => {
  const nullObservable = from([]);
  const middlewareFunction = combineMiddleware(...middleware);
  return middlewareFunction(nullObservable);
};
