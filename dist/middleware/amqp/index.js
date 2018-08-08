"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqpEngine_1 = require("./amqpEngine");
const createCloser_1 = __importDefault(require("./createCloser"));
const createReceiver_1 = __importDefault(require("./createReceiver"));
const createSender_1 = __importDefault(require("./createSender"));
exports.createInjectableAmqpConnector = (configureEngine) => (config) => {
    const amqpFactory = configureEngine(config);
    const { declarations } = config;
    const close = createCloser_1.default(amqpFactory);
    const receiver = createReceiver_1.default(amqpFactory, declarations);
    const sender = createSender_1.default(amqpFactory, declarations);
    return {
        close,
        receiver,
        sender
    };
};
exports.default = exports.createInjectableAmqpConnector(amqpEngine_1.configureAmqpEngine);
//# sourceMappingURL=index.js.map