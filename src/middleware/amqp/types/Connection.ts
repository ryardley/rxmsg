import Joi from 'joi';

export type ConnectionDescription = {
  uri: string;
  socketOptions?: {
    noDelay?: boolean;
    cert?: Buffer;
    key?: Buffer;
    passphrase?: string;
    ca?: Buffer[];
  };
};

export const ConnectionDescriptionSchema = {
  socketOptions: Joi.object({
    ca: Joi.any().optional(),
    cert: Joi.any().optional(),
    key: Joi.any().optional(),
    noDelay: Joi.boolean().optional(),
    passphrase: Joi.string().optional()
  }).optional(),
  uri: Joi.string()
};
