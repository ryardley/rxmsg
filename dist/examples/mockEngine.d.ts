/// <reference types="node" />
import { IAmqpEngine, IAmqpEngineMessage } from '../middleware/amqp/types';
interface IMockEngineConfig {
    onPublish?: (a: IPublishBehaviourArgs) => void;
    decorator?: (a: IAmqpEngine) => IAmqpEngine;
}
declare type MessageCalback = (m: IAmqpEngineMessage) => void;
interface IPublishBehaviourArgs {
    exchange: string;
    routingKey: string;
    content: Buffer;
    opts: any;
    onMessage: MessageCalback;
}
export declare function getMockEngine({ onPublish, decorator }?: IMockEngineConfig): IAmqpEngine;
export {};
