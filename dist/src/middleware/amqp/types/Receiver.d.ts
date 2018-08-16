import Joi from 'joi';
import { BindingDescription } from './Binding';
export declare type ReceiverDescription = {
    queue?: string;
    consumerTag?: string;
    noAck?: boolean;
    exclusive?: boolean;
    priority?: number;
    arguments?: object;
    prefetch?: number;
    bindings?: BindingDescription[];
};
export declare const ReceiverDescriptionSchema: {
    arguments: Joi.AnySchema;
    bindings: Joi.ArraySchema;
    consumerTag: Joi.StringSchema;
    exclusive: Joi.BooleanSchema;
    noAck: Joi.BooleanSchema;
    prefetch: Joi.NumberSchema;
    priority: Joi.NumberSchema;
    queue: Joi.StringSchema;
};
