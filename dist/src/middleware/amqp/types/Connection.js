"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.ConnectionDescriptionSchema = {
    socketOptions: joi_1.default.object({
        ca: joi_1.default.any().optional(),
        cert: joi_1.default.any().optional(),
        key: joi_1.default.any().optional(),
        noDelay: joi_1.default.boolean().optional(),
        passphrase: joi_1.default.string().optional()
    }).optional(),
    uri: joi_1.default.string()
};
//# sourceMappingURL=Connection.js.map