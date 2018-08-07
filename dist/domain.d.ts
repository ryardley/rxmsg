import { Observable, Subject } from 'rxjs';
export interface IMessage {
    content: any;
    route?: any;
    ack?: () => void;
}
export declare type MiddlewareCreator<T> = (c: T) => Middleware;
export declare type ConfiguredMiddlewareCreator<T, Q> = (c: T) => MiddlewareCreator<Q>;
export declare type Producer = Subject<IMessage>;
export declare type Consumer = Observable<IMessage>;
export declare type Middleware = (a: Observable<IMessage>) => Observable<IMessage>;
