import Joi from 'joi';

// TODO: breakout to file
export type ExchangeDescription = {
  name: string;
  type: 'fanout' | 'topic' | 'direct';
  durable?: boolean;
  internal?: boolean;
  autoDelete?: boolean;
  alternateExchange?: string;
  arguments?: any;
};

export const ExchangeDescriptionSchema = {
  alternateExchange: Joi.string().optional(),
  autoDelete: Joi.boolean().optional(),
  durable: Joi.boolean().optional(),
  internal: Joi.boolean().optional(),
  name: Joi.string(),
  type: Joi.string().valid('fanout', 'topic', 'direct')
};
