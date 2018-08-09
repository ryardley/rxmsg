"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// type MiddlewareCombiner<T> = (...a: Array<Middleware<T>>) => Middleware<T>;
function identityMiddleware(a) {
    return a;
}
function combineMiddleware(...fns) {
    if (fns.length === 0) {
        return identityMiddleware;
    }
    return fns.reduce((fn1, fn2) => a => fn2(fn1(a)));
}
exports.combineMiddleware = combineMiddleware;
//# sourceMappingURL=middleware.js.map