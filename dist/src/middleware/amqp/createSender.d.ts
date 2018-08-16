import { Middleware } from '../../types';
import { AmqpDeclarations, AmqpEngineFactory, AmqpMessageOut } from './types';
declare type CreateSender = (engineCreator: AmqpEngineFactory, config: AmqpDeclarations) => () => Middleware<AmqpMessageOut>;
declare const createSender: CreateSender;
export default createSender;
