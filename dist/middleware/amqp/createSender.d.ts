import { Observable } from 'rxjs';
import { IAmqpConfig, IAmqpMessageProducer } from './types';
declare const createSender: (config: IAmqpConfig) => () => (stream: Observable<IAmqpMessageProducer>) => Observable<IAmqpMessageProducer>;
export default createSender;
