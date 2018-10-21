const { createProducer } = require('../../build/src');
const { createAmqpConnector } = require('../../build/src/amqp');
const { amqpConfig } = require('./amqpConfig');

const middleware = createAmqpConnector(amqpConfig).sender();
const producer = createProducer(middleware);

setInterval(() => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  producer.next({
    body: `(${hex}) Hello World!`,
    to: 'hello'
  });
}, 2000);
