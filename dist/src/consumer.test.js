"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const consumer_1 = require("./consumer");
it('should send messages from the middleware to the consumer', () => {
    const mockFn = jest.fn();
    const middleware = () => {
        return rxjs_1.Observable.create((observer) => {
            observer.next({ content: 1 });
            observer.next({ content: 2 });
            observer.next({ content: 3 });
            observer.next({ content: 4 });
        });
    };
    const consumer = consumer_1.createConsumer(middleware);
    consumer.subscribe(mockFn);
    expect(mockFn.mock.calls.length).toBe(4);
});
//# sourceMappingURL=consumer.test.js.map