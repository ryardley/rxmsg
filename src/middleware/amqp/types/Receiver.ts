import Joi from 'joi';
import { BindingDescription, BindingDescriptionSchema } from './Binding';

export type ReceiverDescription = {
  queue?: string; // default to '' <- anon
  consumerTag?: string; // best to ignore this as given automatically
  noAck?: boolean; // if true will dequeue messages as soon as they have been sent
  exclusive?: boolean; // wont let anyone else consume this queue,
  priority?: number;
  arguments?: object;
  prefetch?: number;
  bindings?: BindingDescription[];
};

export const ReceiverDescriptionSchema = {
  arguments: Joi.any().optional(),
  bindings: Joi.array()
    .optional()
    .items(BindingDescriptionSchema),
  consumerTag: Joi.string().optional(),
  exclusive: Joi.boolean().optional(),
  noAck: Joi.boolean().optional(),
  prefetch: Joi.number().optional(),
  priority: Joi.number().optional(),
  queue: Joi.string()
    .optional()
    .allow('')
};
