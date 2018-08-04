"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
function throwConnectionError(err) {
    throw new Error(`Rabbit middleware could not connect to RabbitMQ. ${err}`);
}
function createConnection(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { uri, socketOptions } = config;
        try {
            return yield amqplib_1.default.connect(uri, socketOptions);
        }
        catch (err) {
            throwConnectionError(err);
        }
    });
}
// TODO: fix concurrent connections issue
// we only need a single TCP connection per node and can use channels
let singletonConn = null;
function getConnection(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!singletonConn) {
            console.log('Creating connection...'); // tslint:disable-line
            try {
                singletonConn = yield createConnection(config);
            }
            catch (err) {
                throwConnectionError(err);
            }
        }
        return singletonConn;
    });
}
exports.getConnection = getConnection;
function closeConnection(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield getConnection(config);
        return yield conn.close();
    });
}
exports.closeConnection = closeConnection;
// TODO: Listen for process kill and disconnect? Maybe this happens automatically
function createChannel(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield getConnection(config);
        return yield conn.createChannel();
    });
}
exports.default = createChannel;
//# sourceMappingURL=createChannel.js.map