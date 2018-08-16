"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
exports.BindingDescriptionSchema = runtypes_1.Record({
    source: runtypes_1.String
}).And(runtypes_1.Partial({
    arguments: runtypes_1.Dictionary(runtypes_1.Partial({})),
    destination: runtypes_1.String,
    pattern: runtypes_1.String,
    type: runtypes_1.Union(runtypes_1.Literal('exchange'), runtypes_1.Literal('queue')) // default to queue
}));
//# sourceMappingURL=Binding.js.map