"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createMessageClient(...middleware) {
    if (!middleware || middleware.length === 0) {
        throw new Error('No middleware provided to message client.');
    }
}
exports.default = createMessageClient;
//# sourceMappingURL=createMessageClient.js.map