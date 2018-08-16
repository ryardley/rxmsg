"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
function createValidator(schemaLike) {
    return (value) => {
        const { error } = joi_1.default.validate(value, schemaLike);
        if (error) {
            throw new Error(error.message);
        }
        return value;
    };
}
exports.createValidator = createValidator;
//# sourceMappingURL=validator.js.map