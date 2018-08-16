import Joi from 'joi';
export declare type BindingDescription = {
    arguments?: any;
    destination?: string;
    pattern?: string;
    source: string;
    type?: 'exchange' | 'queue';
};
export declare const BindingDescriptionSchema: {
    arguments: Joi.ObjectSchema;
    destination: Joi.StringSchema;
    pattern: Joi.StringSchema;
    source: Joi.StringSchema;
    type: Joi.StringSchema;
};
