"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const middleware_1 = require("./middleware");
describe('combineMiddleware', () => {
    it('should send messages in order', () => {
        const log = [];
        const middleware1 = o => o.pipe(operators_1.tap(msg => log.push(`middleware1: ${msg.content}`)));
        const middleware2 = o => o.pipe(operators_1.tap(msg => log.push(`middleware2: ${msg.content}`)));
        const middleware3 = o => o.pipe(operators_1.tap(msg => log.push(`middleware3: ${msg.content}`)));
        const middlewareFunc = middleware_1.combineMiddleware(middleware1, middleware2, middleware3);
        const s = middlewareFunc(rxjs_1.from([{ content: 1 }, { content: 2 }, { content: 3 }])).subscribe(msg => {
            log.push(`subscribe: ${msg.content}`);
        });
        expect(log).toEqual([
            // First message
            'middleware1: 1',
            'middleware2: 1',
            'middleware3: 1',
            'subscribe: 1',
            // Second message
            'middleware1: 2',
            'middleware2: 2',
            'middleware3: 2',
            'subscribe: 2',
            // Third message
            'middleware1: 3',
            'middleware2: 3',
            'middleware3: 3',
            'subscribe: 3'
        ]);
        s.unsubscribe();
    });
    describe('no middleware function', () => {
        it('should send the observer through', () => {
            const log = [];
            middleware_1.combineMiddleware()(rxjs_1.from([{ content: 1, route: {} }, { content: 2, route: {} }])).subscribe(msg => log.push(`subscribe: ${msg.content}`));
            expect(log).toEqual(['subscribe: 1', 'subscribe: 2']);
        });
    });
});
//# sourceMappingURL=middleware.test.js.map