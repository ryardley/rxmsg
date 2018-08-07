import { Middleware } from './domain';
declare type MiddlewareCombiner = (...a: Middleware[]) => Middleware;
export declare const combineMiddleware: MiddlewareCombiner;
export {};
