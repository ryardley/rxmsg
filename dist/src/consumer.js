"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const middleware_1 = require("./middleware");
function createConsumer(...middleware) {
    const nullObservable = rxjs_1.from([]);
    const middlewareFunction = middleware_1.combineMiddleware(...middleware);
    return middlewareFunction(nullObservable);
}
exports.createConsumer = createConsumer;
//# sourceMappingURL=consumer.js.map