import { IMessage, Middleware } from '../../types';
import { IAmqpConfig, IAmqpMessageIn, IAmqpReceiver } from './types';
declare type RecieverCreator<T extends IMessage> = (c: IAmqpConfig) => (r: IAmqpReceiver) => Middleware<T>;
declare const createReceiver: RecieverCreator<IAmqpMessageIn>;
export default createReceiver;
