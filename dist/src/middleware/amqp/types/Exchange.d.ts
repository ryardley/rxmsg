import Joi from 'joi';
export declare type ExchangeDescription = {
    name: string;
    type: 'fanout' | 'topic' | 'direct';
    durable?: boolean;
    internal?: boolean;
    autoDelete?: boolean;
    alternateExchange?: string;
    arguments?: any;
};
export declare const ExchangeDescriptionSchema: {
    alternateExchange: Joi.StringSchema;
    autoDelete: Joi.BooleanSchema;
    durable: Joi.BooleanSchema;
    internal: Joi.BooleanSchema;
    name: Joi.StringSchema;
    type: Joi.StringSchema;
};
