/// <reference types="node" />
import Joi from 'joi';
export declare type ConnectionDescription = {
    uri: string;
    socketOptions?: {
        noDelay?: boolean;
        cert?: Buffer;
        key?: Buffer;
        passphrase?: string;
        ca?: Buffer[];
    };
};
export declare const ConnectionDescriptionSchema: {
    socketOptions: Joi.ObjectSchema;
    uri: Joi.StringSchema;
};
