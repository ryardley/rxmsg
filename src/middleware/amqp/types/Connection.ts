import { Dictionary, Partial, Record, Static, String } from 'runtypes';

export const ConnectionDescriptionSchema = Record({
  uri: String
}).And(
  Partial({
    // TODO: Cannot easily check against buffers with runtypes should look like this:
    // socketOptions?: {
    //   noDelay?: boolean;
    //   cert?: Buffer;
    //   key?: Buffer;
    //   passphrase?: string;
    //   ca?: Buffer[];
    // };
    socketOptions: Dictionary(Partial({}))
  })
);

export type ConnectionDescription = Static<typeof ConnectionDescriptionSchema>;
