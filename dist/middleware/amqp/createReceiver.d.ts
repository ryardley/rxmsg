import { IMessage, Middleware } from '../../types';
import { IAmqpConfig, IAmqpMessageConsumed, IAmqpReceiver } from './types';
declare type RecieverCreator<T extends IMessage> = (c: IAmqpConfig) => (r: IAmqpReceiver) => Middleware<T>;
declare const createReceiver: RecieverCreator<IAmqpMessageConsumed>;
export default createReceiver;
