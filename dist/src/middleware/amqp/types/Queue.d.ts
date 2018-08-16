import Joi from 'joi';
export declare type QueueDescription = {
    name: string;
    durable?: boolean;
    exclusive?: boolean;
    autoDelete?: boolean;
    arguments?: any;
};
export declare type QueueShortDescription = QueueDescription | string;
export declare const QueueDescriptionSchema: {
    arguments: Joi.ObjectSchema;
    autoDelete: Joi.BooleanSchema;
    durable: Joi.BooleanSchema;
    exclusive: Joi.BooleanSchema;
    name: Joi.StringSchema;
};
