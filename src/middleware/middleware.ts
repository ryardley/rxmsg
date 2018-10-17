import { Observable } from 'rxjs';
import { IMessage, Middleware } from '../types';

// type MiddlewareCombiner<T> = (...a: Array<Middleware<T>>) => Middleware<T>;

function identityMiddleware<T>(a: Observable<T>): Observable<T> {
  return a;
}

export function combineMiddleware<T extends IMessage>(
  ...fns: Array<Middleware<T>>
): Middleware<T> {
  if (fns.length === 0) {
    return identityMiddleware;
  }

  return fns.reduce((fn1, fn2) => a => fn2(fn1(a)));
}
