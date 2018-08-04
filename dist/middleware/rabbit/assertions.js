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
function enrichQueue(queueOrString) {
    return typeof queueOrString === 'string'
        ? {
            exclusive: true,
            name: queueOrString
        }
        : queueOrString;
}
exports.enrichQueue = enrichQueue;
function enrichBinding(binding) {
    const { arguments: args, destination = '', pattern = '', source, type = 'queue' } = binding;
    return {
        arguments: args,
        destination,
        pattern,
        source,
        type
    };
}
function containsQueue(array = [], queue) {
    array.find(item => enrichQueue(item).name === enrichQueue(queue).name);
}
exports.containsQueue = containsQueue;
function assertQueue(channel, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        const _a = enrichQueue(queue), { name } = _a, opts = __rest(_a, ["name"]);
        return channel.assertQueue(name, opts);
    });
}
exports.assertQueue = assertQueue;
function assertQueues(channel, queues) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(queues.map(queue => assertQueue(channel, queue)));
    });
}
exports.assertQueues = assertQueues;
function assertExchanges(channel, exchanges) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(exchanges.map((_a) => {
            var { name, type } = _a, opts = __rest(_a, ["name", "type"]);
            return channel.assertExchange(name, type, opts);
        }));
    });
}
exports.assertExchanges = assertExchanges;
function assertIfAnonymousQueue(channel, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        if (queue !== '') {
            return queue; // assume this already exists
        }
        const serverResponse = yield assertQueue(channel, queue);
        return serverResponse.queue;
    });
}
exports.assertIfAnonymousQueue = assertIfAnonymousQueue;
function assertBindings(channel, bindings, defaultQueue) {
    return Promise.all(bindings
        .map(enrichBinding)
        .map(({ arguments: args, destination, pattern, source, type }) => {
        const dest = destination || defaultQueue;
        const func = {
            exchange: channel.bindExchange.bind(channel),
            queue: channel.bindQueue.bind(channel)
        }[type];
        return func(dest, source, pattern, args);
    })).catch(e => {
        throw e;
    });
}
exports.assertBindings = assertBindings;
function assertDeclarations(channel, declarations) {
    return __awaiter(this, void 0, void 0, function* () {
        const { queues = [], exchanges = [] } = declarations;
        return Promise.all([
            assertQueues(channel, queues),
            assertExchanges(channel, exchanges)
        ]);
    });
}
exports.assertDeclarations = assertDeclarations;
//# sourceMappingURL=assertions.js.map