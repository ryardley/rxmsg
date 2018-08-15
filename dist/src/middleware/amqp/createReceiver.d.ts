import { Middleware } from '../../types';
import { IAmqpDeclarations, IAmqpEngineFactory, IAmqpMessageIn, IAmqpReceiverDescription } from './types';
declare type CreateReceiver = (engineCreator: IAmqpEngineFactory, config: IAmqpDeclarations) => (r: IAmqpReceiverDescription) => Middleware<IAmqpMessageIn>;
declare const createReceiver: CreateReceiver;
export default createReceiver;
