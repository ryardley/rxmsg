"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const src_1 = require("../src");
const getMockConnector_1 = __importDefault(require("./helpers/getMockConnector"));
it('should simulate work queues', done => {
    const { createAmqpConnector, channel: engine } = getMockConnector_1.default();
    const { sender, receiver } = createAmqpConnector({
        declarations: {
            queues: [
                {
                    durable: true,
                    name: 'task_queue'
                }
            ]
        },
        uri: 'amqp://somerabbitserver'
    });
    const producer = src_1.createProducer(sender());
    producer.next({
        content: 'Hello World!',
        persistent: true,
        route: 'task_queue'
    });
    const consumer = src_1.createConsumer(receiver({
        prefetch: 1,
        queue: 'task_queue'
    }));
    const output = [];
    consumer.subscribe(msg => {
        const secs = msg.content.split('.').length - 1;
        output.push(`Received ${msg.content}`);
        expect(msg.content).toEqual('Hello World!');
        setTimeout(() => {
            output.push('Done');
            msg.ack();
            expect(engine.jestSpyCalls.mock.calls).toEqual([
                ['assertQueue', 'task_queue', { durable: true }],
                ['assertQueue', 'task_queue', { durable: true }],
                ['prefetch', 1],
                ['consume', 'task_queue', '_FUNCTION_', {}],
                [
                    'publish',
                    '',
                    'task_queue',
                    Buffer.from(JSON.stringify('Hello World!'))
                ],
                [
                    'ack',
                    {
                        content: Buffer.from(JSON.stringify('Hello World!')),
                        fields: { exchange: '', routingKey: 'task_queue' },
                        properties: {}
                    },
                    false
                ]
            ]);
            done();
        }, secs * 1000);
    });
});
//# sourceMappingURL=02-work-queues.test.js.map