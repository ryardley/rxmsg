"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createValidator(schemaLike) {
    return (value) => {
        schemaLike.check(value);
        return value;
    };
}
exports.createValidator = createValidator;
//# sourceMappingURL=validator.js.map