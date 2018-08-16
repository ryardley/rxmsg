"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.ExchangeDescriptionSchema = {
    alternateExchange: joi_1.default.string().optional(),
    autoDelete: joi_1.default.boolean().optional(),
    durable: joi_1.default.boolean().optional(),
    internal: joi_1.default.boolean().optional(),
    name: joi_1.default.string(),
    type: joi_1.default.string().valid('fanout', 'topic', 'direct')
};
//# sourceMappingURL=Exchange.js.map