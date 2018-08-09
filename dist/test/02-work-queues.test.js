"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const src_1 = require("../src");
const amqp_1 = require("../src/middleware/amqp");
const mockEngine_1 = require("../src/middleware/amqp/mockEngine");
const jestSpyObject_1 = require("./jestSpyObject");
it('should simulate work queues', done => {
    const engine = jestSpyObject_1.jestSpyObject(mockEngine_1.getMockEngine());
    const createAmqpConnector = amqp_1.createInjectableAmqpConnector(() => () => {
        return Promise.resolve(engine);
    });
    const { sender, receiver } = createAmqpConnector({
        declarations: {
            queues: [
                {
                    durable: true,
                    name: 'task_queue'
                }
            ]
        },
        uri: ''
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