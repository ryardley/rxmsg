import Joi from 'joi';
import { BindingDescription } from './Binding';
import { ConnectionDescription } from './Connection';
import { ExchangeDescription } from './Exchange';
import { QueueShortDescription } from './Queue';
export declare type AmqpDeclarations = {
    queues?: QueueShortDescription[];
    exchanges?: ExchangeDescription[];
    bindings?: BindingDescription[];
};
export declare const AmqpDeclarationsSchema: {
    bindings: Joi.ArraySchema;
    exchanges: Joi.ArraySchema;
    queues: Joi.ArraySchema;
};
export declare type AmqpSystemDescription = ConnectionDescription & {
    declarations?: AmqpDeclarations;
};
export declare const AmqpSystemDescriptionSchema: {
    declarations: Joi.ObjectSchema;
    socketOptions: Joi.ObjectSchema;
    uri: Joi.StringSchema;
};
