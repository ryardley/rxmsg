"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const Binding_1 = require("./Binding");
const Connection_1 = require("./Connection");
const Exchange_1 = require("./Exchange");
const Queue_1 = require("./Queue");
exports.AmqpDeclarationsSchema = {
    bindings: joi_1.default.array()
        .items(Binding_1.BindingDescriptionSchema)
        .optional(),
    exchanges: joi_1.default.array()
        .items(Exchange_1.ExchangeDescriptionSchema)
        .optional(),
    queues: joi_1.default.array()
        .items(Queue_1.QueueDescriptionSchema)
        .optional()
};
exports.AmqpSystemDescriptionSchema = Object.assign({}, Connection_1.ConnectionDescriptionSchema, { declarations: joi_1.default.object(exports.AmqpDeclarationsSchema).optional() });
//# sourceMappingURL=Declarations.js.map