"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp_1 = require("../../src/middleware/amqp");
const mockEngine_1 = require("../../src/middleware/amqp/mockEngine");
const jestSpyObject_1 = require("./jestSpyObject");
function getMockedConnector(config) {
    const channel = jestSpyObject_1.jestSpyObject(mockEngine_1.getMockEngine(config));
    const createAmqpConnector = amqp_1.createInjectableAmqpConnector(() => setup => setup ? setup(channel) : Promise.resolve(channel));
    return { channel, createAmqpConnector };
}
exports.default = getMockedConnector;
//# sourceMappingURL=getMockConnector.js.map