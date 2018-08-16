"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
const Binding_1 = require("./Binding");
exports.ReceiverDescriptionSchema = runtypes_1.Partial({
    arguments: runtypes_1.Dictionary(runtypes_1.Partial({})),
    bindings: runtypes_1.Array(Binding_1.BindingDescriptionSchema),
    consumerTag: runtypes_1.String,
    exclusive: runtypes_1.Boolean,
    noAck: runtypes_1.Boolean,
    prefetch: runtypes_1.Number,
    priority: runtypes_1.Number,
    queue: runtypes_1.String // default to '' <- anon
});
//# sourceMappingURL=Receiver.js.map