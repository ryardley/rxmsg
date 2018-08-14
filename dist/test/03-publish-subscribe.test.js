"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const src_1 = require("../src");
const getMockConnector_1 = __importDefault(require("./helpers/getMockConnector"));
it('should be able to run a fanout exchange', done => {
    const { createAmqpConnector, channel: engine } = getMockConnector_1.default();
    const { sender, receiver } = createAmqpConnector({
        declarations: {
            exchanges: [
                {
                    durable: false,
                    name: 'logs',
                    type: 'fanout'
                }
            ]
        },
        uri: ''
    });
    const consumer = src_1.createConsumer(receiver({
        bindings: [
            { source: 'logs' } // string is shorthand for above
        ],
        noAck: true,
        queue: ''
    }));
    consumer.subscribe(msg => {
        expect(engine.jestSpyCalls.mock.calls).toEqual([
            ['assertExchange', 'logs', 'fanout', { durable: false }],
            ['assertExchange', 'logs', 'fanout', { durable: false }],
            ['assertQueue', '', { exclusive: true }],
            ['bindQueue', 'server-queue', 'logs', '', undefined],
            ['consume', 'server-queue', '_FUNCTION_', { noAck: true }],
            ['publish', 'logs', '', Buffer.from('"Hello World!"')]
        ]);
        expect(msg.content).toEqual('Hello World!');
        done();
    });
    const producer = src_1.createProducer(sender());
    producer.next({
        content: 'Hello World!',
        route: { exchange: 'logs' }
    });
});
//# sourceMappingURL=03-publish-subscribe.test.js.map