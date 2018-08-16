"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.BindingDescriptionSchema = {
    arguments: joi_1.default.object().optional(),
    destination: joi_1.default.string().optional(),
    pattern: joi_1.default.string().optional(),
    source: joi_1.default.string(),
    type: joi_1.default.string()
        .optional()
        .valid('exchange', 'queue')
};
//# sourceMappingURL=Binding.js.map