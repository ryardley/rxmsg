import {
  Array,
  Boolean,
  Dictionary,
  Function,
  Number,
  Partial,
  Static,
  String
} from 'runtypes';
import { BindingDescriptionSchema } from './Binding';

export const ReceiverDescriptionSchema = Partial({
  arguments: Dictionary(Partial({})),
  bindings: Array(BindingDescriptionSchema),
  consumerTag: String, // best to ignore this as given automatically
  exclusive: Boolean, // wont let anyone else consume this queue,
  noAck: Boolean, // if true will dequeue messages as soon as they have been sent
  onReady: Function,
  prefetch: Number,
  priority: Number,
  queue: String // default to '' <- anon
});
export type ReceiverDescription = Static<typeof ReceiverDescriptionSchema>;
