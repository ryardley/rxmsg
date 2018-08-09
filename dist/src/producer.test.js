"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const producer_1 = require("./producer");
it('should send messages from the producer to the middleware', () => {
    const mockFn = jest.fn();
    const nullStream = rxjs_1.from([]);
    const middleware = o => {
        o.pipe(operators_1.tap(mockFn)).subscribe();
        return nullStream;
    };
    const producer = producer_1.createProducer(middleware);
    producer.next({ content: 1 });
    expect(mockFn.mock.calls.length).toBe(1);
    producer.next({ content: 2 });
    producer.next({ content: 3 });
    expect(mockFn.mock.calls.length).toBe(3);
});
it('should store messages until it is subscribed', done => {
    const middleware = o => {
        const mockFn = jest.fn();
        setTimeout(() => {
            o.subscribe(mockFn);
            expect(mockFn.mock.calls).toEqual([[{ content: 1 }], [{ content: 2 }]]);
            done();
        }, 100);
        return rxjs_1.from([]); // nullStream;
    };
    const producer = producer_1.createProducer(middleware);
    producer.next({ content: 1 });
    producer.next({ content: 2 });
});
//# sourceMappingURL=producer.test.js.map