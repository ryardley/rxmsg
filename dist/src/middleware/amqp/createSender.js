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
const logger_1 = __importDefault(require("../../logger"));
const assertions_1 = require("./assertions");
const log = new logger_1.default({ label: 'createSender' });
function serializeMessage(message) {
    return JSON.stringify(message);
}
function getRouteValues(route) {
    return typeof route === 'string'
        ? {
            exchange: '',
            key: route
        }
        : {
            exchange: route.exchange,
            key: route.key || ''
        };
}
function setupSender(createChannel, declarations, stream) {
    return __awaiter(this, void 0, void 0, function* () {
        let subscription;
        const setupChannel = (channel) => __awaiter(this, void 0, void 0, function* () {
            yield assertions_1.assertDeclarations(channel, declarations);
            // subscribe on next tick so channel is ready
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // ensure we are not already on a subscription
                yield tearDownChannel();
                subscription = stream.subscribe((_a) => {
                    var { route } = _a, msg = __rest(_a, ["route"]);
                    const { exchange, key } = getRouteValues(route);
                    // TODO: Perhaps give this a special verbose logging key
                    log.info(`Publishing message: ${JSON.stringify(msg)}`);
                    const content = serializeMessage(msg.content);
                    if (!channel.publish(exchange, key, Buffer.from(content))) {
                        log.error('channel write buffer is full!');
                    }
                });
            }), 0);
            return channel;
        });
        const tearDownChannel = () => {
            if (subscription) {
                subscription.unsubscribe();
            }
            return Promise.resolve();
        };
        return createChannel(setupChannel, tearDownChannel).catch(err => {
            log.error('Could not create channel.', err);
        });
    });
}
// Forward messages
const createSender = (engineCreator, config) => ( /* senderConfig*/) => {
    // We're all configured return the middleware
    return function messageOutMiddleware(stream) {
        setupSender(engineCreator, config, stream).catch(err => {
            log.error(err);
        });
        return stream;
    };
};
exports.default = createSender;
//# sourceMappingURL=createSender.js.map