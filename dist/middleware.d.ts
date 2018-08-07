import { IMessage, Middleware } from './types';
export declare function combineMiddleware<T extends IMessage>(...fns: Array<Middleware<T>>): Middleware<T>;
