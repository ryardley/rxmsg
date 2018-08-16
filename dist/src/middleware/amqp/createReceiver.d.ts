import { Middleware } from '../../types';
import { AmqpDeclarations, AmqpEngineFactory, AmqpMessageIn, ReceiverDescription } from './types';
declare type CreateReceiver = (engineCreator: AmqpEngineFactory, config: AmqpDeclarations) => (r: ReceiverDescription) => Middleware<AmqpMessageIn>;
declare const createReceiver: CreateReceiver;
export default createReceiver;
