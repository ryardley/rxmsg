import Joi from 'joi';
export declare function createValidator<T>(schemaLike: Joi.SchemaLike): (value: any) => T;
