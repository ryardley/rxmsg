"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const rxjs_1 = require("rxjs");
const assertions_1 = require("./assertions");
const createChannel_1 = __importDefault(require("./createChannel"));
function setupReceiver(config, localConfig, observer) {
    return __awaiter(this, void 0, void 0, function* () {
        const { queue = '', prefetch, bindings = [] } = localConfig, receiverConfig = __rest(localConfig, ["queue", "prefetch", "bindings"]);
        const channel = yield createChannel_1.default(config);
        yield assertions_1.assertDeclarations(channel, config.declarations);
        const consumptionQueue = yield assertions_1.assertIfAnonymousQueue(channel, queue);
        yield assertions_1.assertBindings(channel, bindings, consumptionQueue);
        // Prefetch is set
        if (typeof prefetch === 'number') {
            channel.prefetch(prefetch);
        }
        // consume the channel
        channel.consume(consumptionQueue, msg => {
            // handle acknowledgement
            const { noAck } = receiverConfig;
            const ack = noAck
                ? () => { } // tslint:disable-line:no-empty
                : (allUpTo = false) => channel.ack(msg, allUpTo);
            // prepare content
            const content = JSON.parse(msg.content.toString());
            const { fields } = msg;
            // send
            observer.next({
                ack,
                content,
                route: {
                    exchange: fields.exchange,
                    key: fields.routingKey
                }
            });
        }, receiverConfig);
    });
}
// Recieve messages
const createReceiver = (config) => (receiverConfig) => () => {
    return rxjs_1.Observable.create((observer) => {
        setupReceiver(config, receiverConfig, observer).catch(e => {
            throw e;
        });
    });
};
exports.default = createReceiver;
//# sourceMappingURL=createReceiver.js.map