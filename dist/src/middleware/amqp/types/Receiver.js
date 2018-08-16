"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const Binding_1 = require("./Binding");
exports.ReceiverDescriptionSchema = {
    arguments: joi_1.default.any().optional(),
    bindings: joi_1.default.array()
        .optional()
        .items(Binding_1.BindingDescriptionSchema),
    consumerTag: joi_1.default.string().optional(),
    exclusive: joi_1.default.boolean().optional(),
    noAck: joi_1.default.boolean().optional(),
    prefetch: joi_1.default.number().optional(),
    priority: joi_1.default.number().optional(),
    queue: joi_1.default.string()
        .optional()
        .allow('')
};
//# sourceMappingURL=Receiver.js.map