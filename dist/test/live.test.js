"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const amqp_1 = __importDefault(require("../src/middleware/amqp"));
describe('when the message arrives', () => {
    it('should run the hello world example with a live rabbit MQ', done => {
        const { sender, receiver } = amqp_1.default({
            declarations: {
                queues: [
                    {
                        durable: false,
                        name: 'hello'
                    }
                ]
            },
            uri: 'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv'
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
            // Check msg.content
            expect(msg.content).toEqual('Hello World!');
            done();
        });
    }, 7000);
});
//# sourceMappingURL=live.test.js.map