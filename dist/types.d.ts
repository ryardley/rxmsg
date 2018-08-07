import { Observable } from 'rxjs';
export interface IMessage {
    content: any;
    route?: any;
    meta?: any;
}
export declare type Middleware<T extends IMessage> = (a: Observable<T>) => Observable<T>;
