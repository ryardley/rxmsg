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
// import * as amqp from 'amqplib';
const amqp = __importStar(require("amqp-connection-manager"));
// This is done so we can easily mock engines
exports.configureAmqpEngine = config => {
    // Return a channel creator
    return (setupFunc) => __awaiter(this, void 0, void 0, function* () {
        const { uri, socketOptions } = config;
        const connection = amqp.connect([uri], { connectionOptions: socketOptions });
        return new Promise(resolve => {
            const opts = {
                setup: (channel) => __awaiter(this, void 0, void 0, function* () {
                    const engineChannel = {
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
                    resolve(setupFunc ? yield setupFunc(engineChannel) : engineChannel);
                })
            };
            connection.createChannel(opts);
        });
    });
};
//# sourceMappingURL=amqpEngine.js.map