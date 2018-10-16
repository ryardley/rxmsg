const { createConsumer } = require('rxmsg');
const { createAmqpConnector } = require('rxmsg/amqp');
const { amqpConfig } = require('./amqpConfig');

const middleware = createAmqpConnector(amqpConfig).receiver({
  noAck: true,
  queue: 'hello'
});
const consumer = createConsumer(middleware);

consumer.subscribe(msg => {
  console.log(`Received: "${msg.content}"`);
});
