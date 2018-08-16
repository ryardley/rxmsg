import Joi from 'joi';

export type BindingDescription = {
  arguments?: any;
  destination?: string; // if not provided default to anon queue if no anon que then error
  pattern?: string; // ''
  source: string;
  type?: 'exchange' | 'queue'; // default to queue
};

export const BindingDescriptionSchema = {
  arguments: Joi.object().optional(),
  destination: Joi.string().optional(),
  pattern: Joi.string().optional(),
  source: Joi.string(),
  type: Joi.string()
    .optional()
    .valid('exchange', 'queue')
};
