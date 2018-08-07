import { Observable } from 'rxjs';
import { IMessage, Middleware } from './types';

type MiddlewareCombiner = (...a: Middleware[]) => Middleware;

const identityMiddleware: Middleware = (a: Observable<IMessage>) => a;

export const combineMiddleware: MiddlewareCombiner = (...fns) => {
  if (fns.length === 0) {
    return identityMiddleware;
  }

  return fns.reduce((fn1, fn2) => a => fn2(fn1(a)));
};
