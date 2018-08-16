import { Boolean, Dictionary, Partial, Record, Static, String } from 'runtypes';

export const QueueDescriptionSchema = Record({
  name: String
}).And(
  Partial({
    arguments: Dictionary(Partial({})),
    autoDelete: Boolean,
    durable: Boolean,
    exclusive: Boolean
  })
);

export type QueueDescription = Static<typeof QueueDescriptionSchema>;

export type QueueShortDescription = QueueDescription | string;
