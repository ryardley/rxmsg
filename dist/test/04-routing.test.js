"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const src_1 = require("../src");
const getMockConnector_1 = __importDefault(require("./helpers/getMockConnector"));
it('should be able to handle routing', done => {
    const { createAmqpConnector, channel: engine } = getMockConnector_1.default({
        onPublish: ({ exchange, routingKey, content, onMessage }) => {
            // Simulate rabbit behaviour
            if (routingKey === 'error') {
                onMessage({
                    content,
                    fields: { exchange, routingKey },
                    properties: {}
                });
            }
        }
    });
    const { sender, receiver } = createAmqpConnector({
        declarations: {
            exchanges: [
                {
                    durable: false,
                    name: 'direct_logs',
                    type: 'direct'
                }
            ]
        },
        uri: 'amqp://somerabbitserver'
    });
    const producer = src_1.createProducer(sender());
    const consumer = src_1.createConsumer(receiver({
        bindings: ['error'].map(label => ({
            pattern: label,
            source: 'direct_logs'
        })),
        noAck: true
    }));
    consumer.subscribe(msg => {
        expect(engine.jestSpyCalls.mock.calls).toEqual([
            ['assertExchange', 'direct_logs', 'direct', { durable: false }],
            ['assertExchange', 'direct_logs', 'direct', { durable: false }],
            ['assertQueue', '', { exclusive: true }],
            ['bindQueue', 'server-queue', 'direct_logs', 'error', undefined],
            ['consume', 'server-queue', '_FUNCTION_', { noAck: true }],
            ['publish', 'direct_logs', 'warn', Buffer.from('"Hi I am a warning"')],
            ['publish', 'direct_logs', 'error', Buffer.from('"Hi I am an error"')]
        ]);
        expect(msg.content).toEqual('Hi I am an error');
        done();
    });
    producer.next({
        content: 'Hi I am a warning',
        route: { exchange: 'direct_logs', key: 'warn' }
    });
    producer.next({
        content: 'Hi I am an error',
        route: { exchange: 'direct_logs', key: 'error' }
    });
});
//# sourceMappingURL=04-routing.test.js.map