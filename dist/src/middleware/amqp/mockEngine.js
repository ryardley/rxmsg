"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultMockEngine = {
    ack: () => null,
    assertExchange: () => Promise.resolve({ exchange: 'server-exchange' }),
    assertQueue: () => Promise.resolve({ queue: 'server-queue' }),
    bindExchange: () => Promise.resolve({}),
    bindQueue: () => Promise.resolve({}),
    closeConnection: () => Promise.resolve(),
    consume: () => Promise.resolve({}),
    prefetch: () => Promise.resolve({}),
    publish: () => true
};
const defaultPublishBehaviour = ({ exchange, routingKey, content, onMessage }) => {
    setTimeout(() => {
        // ensure a delay this will never be synchronous
        onMessage({ content, fields: { exchange, routingKey }, properties: {} });
    }, 10);
};
function getMockEngine({ onPublish = defaultPublishBehaviour, decorator = a => a } = {}) {
    let onMessage;
    let readyCallback = () => { }; // tslint:disable-line:no-empty
    return decorator(Object.assign({}, defaultMockEngine, { consume: (_, cb) => {
            onMessage = cb; // save callback
            readyCallback();
            return Promise.resolve();
        }, onReady: callback => (readyCallback = callback), publish: (exchange, routingKey, content, opts) => {
            onPublish({ exchange, routingKey, content, opts, onMessage });
            return true;
        } }));
}
exports.getMockEngine = getMockEngine;
//# sourceMappingURL=mockEngine.js.map