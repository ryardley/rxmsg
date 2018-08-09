"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const jestSpyObject_1 = require("../../test/jestSpyObject");
const amqp_1 = require("../middleware/amqp");
const mockEngine_1 = require("../middleware/amqp/mockEngine");
describe('when the message arrives', () => {
    it('should run the hello world example ', done => {
        const channel = jestSpyObject_1.jestSpyObject(mockEngine_1.getMockEngine());
        const createAmqpConnector = amqp_1.createInjectableAmqpConnector(() => () => {
            return Promise.resolve(channel);
        });
        const { sender, receiver } = createAmqpConnector({
            declarations: {
                queues: [
                    {
                        durable: false,
                        name: 'hello'
                    }
                ]
            },
            uri: ''
        });
        const producer = __1.createProducer(sender());
        producer.next({
            content: 'Hello World!',
            route: 'hello'
        });
        const consumer = __1.createConsumer(receiver({
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