import { Array, Partial, Static } from 'runtypes';

import { BindingDescriptionSchema } from './Binding';
import { ConnectionDescriptionSchema } from './Connection';
import { ExchangeDescriptionSchema } from './Exchange';
import { QueueDescriptionSchema } from './Queue';

export const AmqpDeclarationsSchema = Partial({
  bindings: Array(BindingDescriptionSchema),
  exchanges: Array(ExchangeDescriptionSchema),
  queues: Array(QueueDescriptionSchema) // queues can be represented as strings
});

export const AmqpSystemDescriptionSchema = ConnectionDescriptionSchema.And(
  Partial({
    declarations: AmqpDeclarationsSchema
  })
);

export type AmqpDeclarations = Static<typeof AmqpDeclarationsSchema>;
export type AmqpSystemDescription = Static<typeof AmqpSystemDescriptionSchema>;
