import { Observer } from 'rxjs';
import { IMessage, Middleware } from './types';
export declare function createProducer<T extends IMessage>(...middleware: Array<Middleware<T>>): Observer<T>;
