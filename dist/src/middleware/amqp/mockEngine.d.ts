/// <reference types="node" />
import { AmqpProtocolMessage, AmqpTestEngine } from './types';
export declare type MockEngineConfig = {
    onPublish?: (a: PublishBehaviourArgs) => void;
    decorator?: (a: AmqpTestEngine) => AmqpTestEngine;
};
declare type MessageCalback = (m: AmqpProtocolMessage) => void;
declare type PublishBehaviourArgs = {
    exchange: string;
    routingKey: string;
    content: Buffer;
    opts: any;
    onMessage: MessageCalback;
};
export declare function getMockEngine({ onPublish, decorator }?: MockEngineConfig): AmqpTestEngine;
export {};
