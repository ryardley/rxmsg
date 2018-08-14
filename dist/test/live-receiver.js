"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console */
const src_1 = require("../src");
const amqp_1 = __importDefault(require("../src/middleware/amqp"));
const { receiver } = amqp_1.default({
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
const consumer = src_1.createConsumer(receiver({
    noAck: true,
    queue: 'hello'
}));
consumer.subscribe(msg => {
    // Check msg.content
    console.log(`Received: "${msg.content}"`);
});
//# sourceMappingURL=live-receiver.js.map