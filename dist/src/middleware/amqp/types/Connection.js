"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
exports.ConnectionDescriptionSchema = runtypes_1.Record({
    uri: runtypes_1.String
}).And(runtypes_1.Partial({
    // TODO: Cannot easily check against buffers with runtypes should look like this:
    // socketOptions?: {
    //   noDelay?: boolean;
    //   cert?: Buffer;
    //   key?: Buffer;
    //   passphrase?: string;
    //   ca?: Buffer[];
    // };
    socketOptions: runtypes_1.Dictionary(runtypes_1.Partial({}))
}));
//# sourceMappingURL=Connection.js.map