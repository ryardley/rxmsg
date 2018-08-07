import { Observable } from 'rxjs';
import { IRabbitConfig, IRabbitMessageProducer } from './domain';
declare const createSender: (config: IRabbitConfig) => () => (stream: Observable<IRabbitMessageProducer>) => Observable<IRabbitMessageProducer>;
export default createSender;
