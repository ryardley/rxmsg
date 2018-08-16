"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
exports.ExchangeDescriptionSchema = runtypes_1.Record({
    name: runtypes_1.String,
    type: runtypes_1.Union(runtypes_1.Literal('fanout'), runtypes_1.Literal('topic'), runtypes_1.Literal('direct'))
}).And(runtypes_1.Partial({
    alternateExchange: runtypes_1.String,
    arguments: runtypes_1.Dictionary(runtypes_1.Partial({})),
    autoDelete: runtypes_1.Boolean,
    durable: runtypes_1.Boolean,
    internal: runtypes_1.Boolean
}));
//# sourceMappingURL=Exchange.js.map