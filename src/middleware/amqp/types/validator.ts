import Joi from 'joi';

export function createValidator<T>(schemaLike: Joi.SchemaLike) {
  return (value: any): T => {
    const { error } = Joi.validate(value, schemaLike);
    if (error) {
      throw new Error(error.message);
    }

    return value;
  };
}
