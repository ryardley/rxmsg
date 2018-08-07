import { IAmqpConfig, IAmqpReceiver } from './domain';
declare const createReceiver: (config: IAmqpConfig) => (receiverConfig: IAmqpReceiver) => () => any;
export default createReceiver;
