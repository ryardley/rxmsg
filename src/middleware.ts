import { Middleware } from './domain';

type MiddlewareCombiner = (...a: Middleware[]) => Middleware;

export const combineMiddleware: MiddlewareCombiner = (...fns) => {
  return fns.reduce((fn1, fn2) => {
    return a => fn2(fn1(a));
  });
};
