import { Observable } from 'rxjs';
import { Middleware } from './types';
export declare function createConsumer<T>(...middleware: Array<Middleware<T>>): Observable<T>;
