import Joi from 'joi';

export type QueueDescription = {
  name: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: any;
};

export type QueueShortDescription = QueueDescription | string;

export const QueueDescriptionSchema = {
  arguments: Joi.object().optional(),
  autoDelete: Joi.boolean().optional(),
  durable: Joi.boolean().optional(),
  exclusive: Joi.boolean().optional(),
  name: Joi.string()
};
