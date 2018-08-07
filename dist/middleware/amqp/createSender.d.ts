import { Observable } from 'rxjs';
import { IAmqpConfig, IAmqpMessageOut } from './types';
declare const createSender: (config: IAmqpConfig) => () => (stream: Observable<IAmqpMessageOut>) => Observable<IAmqpMessageOut>;
export default createSender;
