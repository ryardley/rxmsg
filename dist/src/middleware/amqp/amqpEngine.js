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
/* tslint:disable:no-console */
// import * as amqp from 'amqplib';
const amqp = __importStar(require("amqp-connection-manager"));
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
function setupEngine(connection, setupFunc) {
    return new Promise(resolve => {
        connection.createChannel({
            setup(channel) {
                console.log('   -> RUNNING SETUP');
                setupFunc(createEngine(channel, connection)).then(resolve);
            }
        });
    });
}
// This is done so we can easily mock engines
exports.configureAmqpEngine = config => {
    // Return a channel creator
    return function channelCreator(setupFunc = Promise.resolve, tearDown = Promise.resolve) {
        const { uri, socketOptions: connectionOptions } = config;
        const connection = amqp.connect(ensureArray(uri), { connectionOptions });
        connection.on('connect', () => {
            console.log('   -> RUNNING CONNECT');
            console.log('Connected!');
        });
        connection.on('disconnect', (params) => __awaiter(this, void 0, void 0, function* () {
            yield tearDown();
            console.log('   -> RUNNING DISCONNECT');
            console.log('Disconnected.', params.err.stack);
        }));
        return setupEngine(connection, setupFunc);
    };
};
//# sourceMappingURL=amqpEngine.js.map