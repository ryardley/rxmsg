import { Middleware } from './types';
export declare function combineMiddleware<T>(...fns: Array<Middleware<T>>): Middleware<T>;
