import Joi from 'joi';
import { BindingDescription, BindingDescriptionSchema } from './Binding';
import {
  ConnectionDescription,
  ConnectionDescriptionSchema
} from './Connection';
import { ExchangeDescription, ExchangeDescriptionSchema } from './Exchange';
import { QueueDescriptionSchema, QueueShortDescription } from './Queue';

export type AmqpDeclarations = {
  queues?: QueueShortDescription[]; // queues can be represented as strings
  exchanges?: ExchangeDescription[];
  bindings?: BindingDescription[];
};

export const AmqpDeclarationsSchema = {
  bindings: Joi.array()
    .items(BindingDescriptionSchema)
    .optional(),
  exchanges: Joi.array()
    .items(ExchangeDescriptionSchema)
    .optional(),
  queues: Joi.array()
    .items(QueueDescriptionSchema)
    .optional()
};

export type AmqpSystemDescription = ConnectionDescription & {
  declarations?: AmqpDeclarations;
};

export const AmqpSystemDescriptionSchema = {
  ...ConnectionDescriptionSchema,
  declarations: Joi.object(AmqpDeclarationsSchema).optional()
};
