import {
  Boolean,
  Dictionary,
  Literal,
  Partial,
  Record,
  Static,
  String,
  Union
} from 'runtypes';

export const ExchangeDescriptionSchema = Record({
  name: String,
  type: Union(Literal('fanout'), Literal('topic'), Literal('direct'))
}).And(
  Partial({
    alternateExchange: String,
    arguments: Dictionary(Partial({})),
    autoDelete: Boolean,
    durable: Boolean,
    internal: Boolean
  })
);

export type ExchangeDescription = Static<typeof ExchangeDescriptionSchema>;
