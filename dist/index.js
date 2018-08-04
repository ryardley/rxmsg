"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var producer_1 = require("./producer");
exports.createProducer = producer_1.createProducer;
var consumer_1 = require("./consumer");
exports.createConsumer = consumer_1.createConsumer;
var rabbit_1 = require("./middleware/rabbit");
exports.createAmqpConnector = rabbit_1.default;
//# sourceMappingURL=index.js.map