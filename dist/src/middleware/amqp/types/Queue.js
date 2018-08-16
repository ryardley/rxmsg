"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
exports.QueueDescriptionSchema = runtypes_1.Record({
    name: runtypes_1.String
}).And(runtypes_1.Partial({
    arguments: runtypes_1.Dictionary(runtypes_1.Partial({})),
    autoDelete: runtypes_1.Boolean,
    durable: runtypes_1.Boolean,
    exclusive: runtypes_1.Boolean
}));
//# sourceMappingURL=Queue.js.map