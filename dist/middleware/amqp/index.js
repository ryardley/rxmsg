"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createChannel_1 = require("./createChannel");
const createReceiver_1 = __importDefault(require("./createReceiver"));
const createSender_1 = __importDefault(require("./createSender"));
exports.default = (c) => {
    return {
        close: () => createChannel_1.closeConnection(c),
        receiver: createReceiver_1.default(c),
        sender: createSender_1.default(c)
    };
};
//# sourceMappingURL=index.js.map