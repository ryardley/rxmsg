"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identityMiddleware = (a) => a;
exports.combineMiddleware = (...fns) => {
    if (fns.length === 0) {
        return identityMiddleware;
    }
    return fns.reduce((fn1, fn2) => a => fn2(fn1(a)));
};
//# sourceMappingURL=middleware.js.map