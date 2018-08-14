"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const minimatch_1 = __importDefault(require("minimatch"));
const src_1 = require("../src");
const getMockConnector_1 = __importDefault(require("./helpers/getMockConnector"));
it('should handle topics', done => {
    const patterns = ['*.exe', '*.jpg', 'cat.*'];
    const { createAmqpConnector, channel: engine } = getMockConnector_1.default({
        onPublish: ({ exchange, routingKey, content, onMessage }) => {
            // Simulate rabbit behaviour match routing patterns
            const matches = patterns.reduce((bl, pat) => bl || minimatch_1.default(routingKey, pat), false);
            if (matches) {
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
                    name: 'topic_logs',
                    type: 'topic'
                }
            ]
        },
        uri: ''
    });
    const producer = src_1.createProducer(sender());
    const consumer = src_1.createConsumer(receiver({
        bindings: patterns.map(pattern => ({
            pattern,
            source: 'topic_logs'
        })),
        noAck: true
    }));
    const output = [];
    consumer.subscribe(msg => {
        output.push(`${msg.route.key}: '${msg.content}'`);
        if (output.length >= 2) {
            expect(engine.jestSpyCalls.mock.calls).toEqual([
                ['assertExchange', 'topic_logs', 'topic', { durable: false }],
                ['assertExchange', 'topic_logs', 'topic', { durable: false }],
                ['assertQueue', '', { exclusive: true }],
                ['bindQueue', 'server-queue', 'topic_logs', '*.exe', undefined],
                ['bindQueue', 'server-queue', 'topic_logs', '*.jpg', undefined],
                ['bindQueue', 'server-queue', 'topic_logs', 'cat.*', undefined],
                ['consume', 'server-queue', '_FUNCTION_', { noAck: true }],
                ['publish', 'topic_logs', 'cat.jpg', Buffer.from('"I am a JPG image"')],
                [
                    'publish',
                    'topic_logs',
                    'fish.png',
                    Buffer.from('"I am a Fish image"')
                ],
                ['publish', 'topic_logs', 'dog.exe', Buffer.from('"I am a Dog exe"')]
            ]);
            expect(output).toEqual([
                "cat.jpg: 'I am a JPG image'",
                "dog.exe: 'I am a Dog exe'"
            ]);
            done();
        }
    });
    producer.next({
        content: 'I am a JPG image',
        route: { exchange: 'topic_logs', key: 'cat.jpg' }
    });
    producer.next({
        content: 'I am a Fish image',
        route: { exchange: 'topic_logs', key: 'fish.png' }
    });
    producer.next({
        content: 'I am a Dog exe',
        route: { exchange: 'topic_logs', key: 'dog.exe' }
    });
});
//# sourceMappingURL=05-topics.test.js.map