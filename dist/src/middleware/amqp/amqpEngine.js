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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as amqp from 'amqplib';
const amqp = __importStar(require("amqp-connection-manager"));
const logger_1 = __importDefault(require("../../logger"));
const log = new logger_1.default({ label: 'amqpEngine' });
function ensureArray(possibleArray) {
    return Array.isArray(possibleArray) ? possibleArray : [possibleArray];
}
function createEngine(channel, connection) {
    return {
        ack: channel.ack.bind(channel),
        assertExchange: channel.assertExchange.bind(channel),
        assertQueue: channel.assertQueue.bind(channel),
        bindExchange: channel.bindExchange.bind(channel),
        bindQueue: channel.bindQueue.bind(channel),
        closeConnection: () => {
            return connection.close();
        },
        consume: channel.consume.bind(channel),
        prefetch: channel.prefetch.bind(channel),
        publish: channel.publish.bind(channel)
    };
}
// This is done so we can easily mock engines
exports.configureAmqpEngine = config => {
    // Return a channel creator
    const engineFactory = (setupFunc = Promise.resolve, tearDown = Promise.resolve) => {
        return new Promise((resolve /*,reject*/) => {
            const { uri, socketOptions: connectionOptions } = config;
            const connection = amqp.connect(ensureArray(uri), { connectionOptions });
            // TODO: Why not run setup here? I guess we would need to create out own channel...
            connection.on('connect', () => {
                log.info('Connected!');
            });
            connection.on('disconnect', (params) => __awaiter(this, void 0, void 0, function* () {
                yield tearDown(params);
                log.error('Disconnected.');
            }));
            connection.createChannel({
                setup(channel) {
                    setupFunc(createEngine(channel, connection)).then(resolve);
                }
            });
        });
    };
    return engineFactory;
};
//# sourceMappingURL=amqpEngine.js.map