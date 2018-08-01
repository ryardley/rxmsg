"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const receiveStream = new rxjs_1.Subject();
// Recieve messages
const createReceiver = () => () => {
    return receiveStream.asObservable();
};
// Forward messages
const createSender = config => (sendStream) => {
    const mappedStream = config && typeof config.delay
        ? sendStream.pipe(operators_1.delay(config.delay))
        : sendStream;
    mappedStream.subscribe(receiveStream);
    return sendStream;
};
exports.default = (config) => ({
    receiver: createReceiver(config),
    sender: createSender(config)
});
//# sourceMappingURL=loopback.js.map