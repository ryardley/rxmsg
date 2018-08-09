import { Observable } from 'rxjs';
import { IMessage, Middleware } from './types';
export declare function createConsumer<T extends IMessage>(...middleware: Array<Middleware<T>>): Observable<T>;
