"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = __importStar(require("amqplib"));
// TODO: use a WeakMap() to manage connections
let singletonConnection;
const closeConnection = () => __awaiter(this, void 0, void 0, function* () {
    return singletonConnection
        ? yield singletonConnection.close()
        : Promise.resolve();
});
// TODO: fix concurrent connections issue need to lock this function until
// promise has resolved and should return same promise while it is resolving
// we only need a single TCP connection per node and can use channels
const ensureConnection = (uri, socketOptions) => __awaiter(this, void 0, void 0, function* () {
    if (!singletonConnection) {
        singletonConnection = yield amqp.connect(uri, socketOptions);
    }
    return singletonConnection;
});
// This is done so we can easily mock engines
exports.configureAmqpEngine = config => {
    // Return a channel creator
    return () => __awaiter(this, void 0, void 0, function* () {
        const { uri, socketOptions } = config;
        yield ensureConnection(uri, socketOptions);
        const channel = yield singletonConnection.createChannel();
        // TODO: Listen for process kill and disconnect? Maybe this happens automatically
        return {
            ack: channel.ack.bind(channel),
            assertExchange: channel.assertExchange.bind(channel),
            assertQueue: channel.assertQueue.bind(channel),
            bindExchange: channel.bindExchange.bind(channel),
            bindQueue: channel.bindQueue.bind(channel),
            closeConnection,
            consume: channel.consume.bind(channel),
            prefetch: channel.prefetch.bind(channel),
            publish: channel.publish.bind(channel)
        };
    });
};
//# sourceMappingURL=amqpEngine.js.map