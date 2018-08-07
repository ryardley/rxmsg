import { IRabbitConfig, IRabbitReceiver } from './domain';
declare const createReceiver: (config: IRabbitConfig) => (receiverConfig: IRabbitReceiver) => () => any;
export default createReceiver;
