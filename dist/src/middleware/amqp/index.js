"use strict";
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
const amqpEngine_1 = require("./amqpEngine");
const createCloser_1 = __importDefault(require("./createCloser"));
const createReceiver_1 = __importDefault(require("./createReceiver"));
const createSender_1 = __importDefault(require("./createSender"));
const types_1 = require("./types");
const validator_1 = require("./types/validator");
const validateInput = validator_1.createValidator(types_1.AmqpSystemDescriptionSchema);
exports.createInjectableAmqpConnector = (createConnectedFactory) => (input) => {
    const _a = validateInput(input), { declarations = {} } = _a, connDescription = __rest(_a, ["declarations"]);
    const connectedFactory = createConnectedFactory(connDescription);
    return {
        close: createCloser_1.default(connectedFactory),
        receiver: createReceiver_1.default(connectedFactory, declarations),
        sender: createSender_1.default(connectedFactory, declarations)
    };
};
exports.default = exports.createInjectableAmqpConnector(amqpEngine_1.configureAmqpEngine);
//# sourceMappingURL=index.js.map