/// <reference types="node" />
import { IAmqpEngineMessage, IAmqpEngineTest } from './types';
interface IMockEngineConfig {
    onPublish?: (a: IPublishBehaviourArgs) => void;
    decorator?: (a: IAmqpEngineTest) => IAmqpEngineTest;
}
declare type MessageCalback = (m: IAmqpEngineMessage) => void;
interface IPublishBehaviourArgs {
    exchange: string;
    routingKey: string;
    content: Buffer;
    opts: any;
    onMessage: MessageCalback;
}
export declare function getMockEngine({ onPublish, decorator }?: IMockEngineConfig): IAmqpEngineTest;
export {};
