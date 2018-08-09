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
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("./assertions");
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
        const channel = yield createChannel();
        yield assertions_1.assertDeclarations(channel, declarations);
        setTimeout(() => {
            stream.subscribe((_a) => {
                var { route } = _a, msg = __rest(_a, ["route"]);
                const { exchange, key } = getRouteValues(route);
                const content = serializeMessage(msg.content);
                if (!channel.publish(exchange, key, Buffer.from(content))) {
                    // Do we throw an error here? What should we do here when the
                    // publish queue needs draining?
                    console.log(`Error publishing: ${JSON.stringify({
                        content,
                        exchange,
                        key
                    })}`);
                }
            });
        }, 500);
    });
}
// Forward messages
const createSender = (engineCreator, config) => () => stream => {
    setupSender(engineCreator, config, stream).catch((e) => {
        throw e;
    });
    return stream;
};
exports.default = createSender;
//# sourceMappingURL=createSender.js.map