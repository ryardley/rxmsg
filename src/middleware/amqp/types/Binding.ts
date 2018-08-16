import {
  Dictionary,
  Literal,
  Partial,
  Record,
  Static,
  String,
  Union
} from 'runtypes';

export const BindingDescriptionSchema = Record({
  source: String
}).And(
  Partial({
    arguments: Dictionary(Partial({})),
    destination: String,
    pattern: String,
    type: Union(Literal('exchange'), Literal('queue')) // default to queue
  })
);

export type BindingDescription = Static<typeof BindingDescriptionSchema>;
