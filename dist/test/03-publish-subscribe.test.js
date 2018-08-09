"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const src_1 = require("../src");
const amqp_1 = require("../src/middleware/amqp");
const mockEngine_1 = require("../src/middleware/amqp/mockEngine");
const jestSpyObject_1 = require("./jestSpyObject");
it('should be able to run a fanout exchange', done => {
    const engine = jestSpyObject_1.jestSpyObject(mockEngine_1.getMockEngine());
    const createAmqpConnector = amqp_1.createInjectableAmqpConnector(() => () => {
        return Promise.resolve(engine);
    });
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