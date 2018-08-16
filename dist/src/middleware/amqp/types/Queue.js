"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.QueueDescriptionSchema = {
    arguments: joi_1.default.object().optional(),
    autoDelete: joi_1.default.boolean().optional(),
    durable: joi_1.default.boolean().optional(),
    exclusive: joi_1.default.boolean().optional(),
    name: joi_1.default.string()
};
//# sourceMappingURL=Queue.js.map