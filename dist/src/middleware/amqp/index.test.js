"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const getMockConnector_1 = __importDefault(require("../../../test/helpers/getMockConnector"));
describe('when I recieve messages from AMQP', () => {
    let channel;
    let middewareReceiver;
    beforeEach(() => {
        const { createAmqpConnector, channel: engine } = getMockConnector_1.default();
        channel = engine;
        const { receiver } = createAmqpConnector({
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
        middewareReceiver = receiver({
            queue: 'hello'
        });
    });
    it('should deserialise messages that are JSON', done => {
        const m = { is: 'a', nested: { cat: 'bird' } };
        const jsonMessage = JSON.stringify(m);
        channel.onReady(() => {
            channel.publish('', 'hello', Buffer.from(jsonMessage));
        });
        middewareReceiver(rxjs_1.from([])).subscribe(msg => {
            expect(msg.content).toEqual(m);
            done();
        });
    });
    it('should not blow up when receiving messages that cannot be parsed as JSON', done => {
        channel.onReady(() => {
            channel.publish('', 'hello', Buffer.from('Foo'));
        });
        middewareReceiver(rxjs_1.from([])).subscribe(msg => {
            expect(msg.content).toEqual('Foo');
            done();
        });
    });
});
//# sourceMappingURL=index.test.js.map