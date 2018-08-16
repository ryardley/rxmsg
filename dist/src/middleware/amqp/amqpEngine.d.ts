import { AmqpEngineFactory } from './types';
export declare const configureAmqpEngine: (config: {
    uri: string;
} & {
    socketOptions?: {
        [_: string]: any;
    } | undefined;
}) => AmqpEngineFactory;
