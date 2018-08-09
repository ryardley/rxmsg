"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const loopback_1 = __importDefault(require("./loopback"));
describe('Using the loopback middleware synchronously', () => {
    const { receiver, sender } = loopback_1.default();
    it('should send and receive messages synchronously via a loopback middleware', () => {
        const log = [];
        const producer = index_1.createProducer(sender);
        const consumer = index_1.createConsumer(receiver);
        consumer.subscribe(msg => {
            log.push(msg);
        });
        producer.next({ content: 'One' });
        producer.next({ content: 'Two' });
        producer.next({ content: 'Three' });
        producer.next({ content: 'Four' });
        expect(log).toEqual([
            { content: 'One' },
            { content: 'Two' },
            { content: 'Three' },
            { content: 'Four' }
        ]);
    });
});
describe('Using the loopback middleware asynchronously', () => {
    const { receiver, sender } = loopback_1.default({
        delay: 300
    });
    it('should send and receive messages asynchronously via a loopback middleware', done => {
        const log = [];
        const producer = index_1.createProducer(sender);
        const consumer = index_1.createConsumer(receiver);
        consumer.subscribe(msg => {
            log.push(msg);
            if (log.length === 4) {
                expect(log).toEqual([
                    { content: 'One' },
                    { content: 'Two' },
                    { content: 'Three' },
                    { content: 'Four' }
                ]);
                done();
            }
        });
        producer.next({ content: 'One' });
        producer.next({ content: 'Two' });
        producer.next({ content: 'Three' });
        producer.next({ content: 'Four' });
        expect(log).toEqual([]);
    });
});
//# sourceMappingURL=loopback.test.js.map