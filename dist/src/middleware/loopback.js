"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const receiveStream = new rxjs_1.Subject();
function createReceiver() {
    return () => receiveStream.asObservable();
}
// Forward messages
const createSender = (config) => (sendStream) => {
    const delayAmount = config.delay || 0;
    const mappedStream = delayAmount
        ? sendStream.pipe(operators_1.delay(delayAmount))
        : sendStream;
    mappedStream.subscribe(receiveStream);
    return sendStream;
};
exports.default = (config = {}) => ({
    receiver: createReceiver(),
    sender: createSender(config)
});
//# sourceMappingURL=loopback.js.map