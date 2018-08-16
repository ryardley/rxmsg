"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const getMockConnector_1 = __importDefault(require("./helpers/getMockConnector"));
describe('when the message arrives', () => {
    it('should run the hello world example ', done => {
        const { createAmqpConnector, channel } = getMockConnector_1.default();
        const { sender, receiver } = createAmqpConnector({
            declarations: {
                queues: [
                    {
                        durable: false,
                        name: 'hello'
                    }
                ]
            },
            uri: 'amqp://somerabbitserver'
        });
        const producer = src_1.createProducer(sender());
        producer.next({
            content: 'Hello World!',
            route: 'hello'
        });
        const consumer = src_1.createConsumer(receiver({
            noAck: true,
            queue: 'hello'
        }));
        consumer.subscribe(msg => {
            // Check consume()
            expect(channel.jestSpyCalls.mock.calls).toEqual([
                ['assertQueue', 'hello', { durable: false }],
                ['assertQueue', 'hello', { durable: false }],
                ['consume', 'hello', '_FUNCTION_', { noAck: true }],
                ['publish', '', 'hello', Buffer.from(JSON.stringify('Hello World!'))]
            ]);
            // Check msg.content
            expect(msg.content).toEqual('Hello World!');
            done();
        });
    });
});
//# sourceMappingURL=01-hello-world.test.js.map