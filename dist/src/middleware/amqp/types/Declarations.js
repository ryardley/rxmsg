"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
const Binding_1 = require("./Binding");
const Connection_1 = require("./Connection");
const Exchange_1 = require("./Exchange");
const Queue_1 = require("./Queue");
exports.AmqpDeclarationsSchema = runtypes_1.Partial({
    bindings: runtypes_1.Array(Binding_1.BindingDescriptionSchema),
    exchanges: runtypes_1.Array(Exchange_1.ExchangeDescriptionSchema),
    queues: runtypes_1.Array(Queue_1.QueueDescriptionSchema) // queues can be represented as strings
});
exports.AmqpSystemDescriptionSchema = Connection_1.ConnectionDescriptionSchema.And(runtypes_1.Partial({
    declarations: exports.AmqpDeclarationsSchema
}));
//# sourceMappingURL=Declarations.js.map