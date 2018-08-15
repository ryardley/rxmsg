"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console */
const src_1 = require("../src");
const amqp_1 = __importDefault(require("../src/middleware/amqp"));
const { sender } = amqp_1.default({
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
setInterval(() => {
    const hex = Math.floor(Math.random() * 16777215).toString(16);
    // console.log(`Sending: (${hex}) "Hello World!"`);
    producer.next({
        content: `(${hex}) Hello World!`,
        route: 'hello'
    });
}, 2000);
//# sourceMappingURL=live-sender.js.map