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
const amqplib_1 = __importDefault(require("amqplib"));
const rxjs_1 = require("rxjs");
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
// we only need a single TCP connection per node and can use channels
let singletonConn;
function getConnection(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!singletonConn) {
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
// TODOL: Listen for process kill and disconnect
function createChannel(config) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getConnection...');
        const conn = yield getConnection(config);
        console.log('createChannel...');
        const channel = yield conn.createChannel();
        console.log('returning channel...');
        return channel;
    });
}
// Forward messages
const createSender = config => (stream) => {
    console.log('createSender');
    // TODO: How do we handle memory leaks wrt subscriptions
    createChannel(config)
        .then((channel) => {
        console.log('Subscribing to stream...');
        stream.subscribe((_a) => {
            var { dest } = _a, msg = __rest(_a, ["dest"]);
            console.log('Message received in stream: ' + JSON.stringify(msg));
            // const exchange = (dest && dest.exchange) || '';
            const exchange = ''; // for now leave this as empty
            const queue = (dest && dest.queue) || '';
            channel.assertQueue(queue, { durable: true });
            // if (exchange) {
            //   channel.assertExchange(exchange, '');
            // }
            channel.publish(exchange, queue, new Buffer(JSON.stringify(msg.payload)));
        });
    })
        .catch(e => console.error(e));
    return stream;
};
// Recieve messages
const createReceiver = config => () => {
    // TODO: need to carefully think about error handling scenarios
    // TODO: perhaps we need to have different message types for sending and
    //       recieving as reieving will have ack callbacks
    console.log('createReceiver');
    return rxjs_1.Observable.create((observer) => {
        createChannel(config)
            .then(channel => {
            // how are we configuring queue?
            channel.assertQueue(config.queue, { durable: true });
            channel.consume(config.queue, msg => {
                const payload = JSON.parse(msg.content.toString());
                const ack = () => channel.ack(msg);
                observer.next({
                    ack,
                    payload
                });
            }
            // { noAck: false }
            );
        })
            .catch(e => console.error(e));
    });
};
exports.default = (c) => ({
    receiver: createReceiver(c),
    sender: createSender(c)
});
//# sourceMappingURL=rabbit.js.map