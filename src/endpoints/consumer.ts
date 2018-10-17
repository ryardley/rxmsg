import { from, Observable } from 'rxjs';
import { combineMiddleware } from '../middleware/middleware';
import { IMessage, Middleware } from '../types';

export function createConsumer<T extends IMessage>(
  ...middleware: Array<Middleware<T>>
): Observable<T> {
  const nullObservable = from([]);
  const middlewareFunction = combineMiddleware<T>(...middleware);
  return middlewareFunction(nullObservable);
}
