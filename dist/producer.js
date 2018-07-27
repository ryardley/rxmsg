"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const middleware_1 = require("./middleware");
exports.createProducer = (...middleware) => {
    const subject = new rxjs_1.Subject();
    const middlewareFunction = middleware_1.combineMiddleware(...middleware);
    middlewareFunction(subject.asObservable());
    return subject;
};
//# sourceMappingURL=producer.js.map