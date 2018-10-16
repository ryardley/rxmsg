const { createProducer } = require('rxmsg');
const { createAmqpConnector } = require('rxmsg/amqp');
const { amqpConfig } = require('./amqpConfig');

const middleware = createAmqpConnector(amqpConfig).sender();
const producer = createProducer(middleware);

setInterval(() => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  producer.next({
    content: `(${hex}) Hello World!`,
    route: 'hello'
  });
}, 2000);
