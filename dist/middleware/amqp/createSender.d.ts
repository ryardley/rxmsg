import { Middleware } from '../../types';
import { IAmqpDeclarations, IAmqpEngineFactory, IAmqpMessageOut } from './types';
declare type CreateSender = (engineCreator: IAmqpEngineFactory, config: IAmqpDeclarations) => () => Middleware<IAmqpMessageOut>;
declare const createSender: CreateSender;
export default createSender;
