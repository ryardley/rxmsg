import { Observer } from 'rxjs';
import { Middleware } from './types';
export declare function createProducer<T>(...middleware: Array<Middleware<T>>): Observer<T>;
