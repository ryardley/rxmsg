import { ReplaySubject } from 'rxjs';
import { IMessage, Middleware } from './domain';
export declare const createProducer: (...middleware: Middleware[]) => ReplaySubject<IMessage>;
