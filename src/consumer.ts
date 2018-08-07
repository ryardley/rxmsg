import { from, Observable } from 'rxjs';
import { combineMiddleware } from './middleware';
import { Middleware } from './types';

export function createConsumer<T>(
  ...middleware: Array<Middleware<T>>
): Observable<T> {
  const nullObservable = from([]);
  const middlewareFunction = combineMiddleware<T>(...middleware);
  return middlewareFunction(nullObservable);
}
