const { createConsumer, createProducer } = require('../../build/src');
const { createLoopbackConnector } = require('../../build/src/loopback');

const { receiver, sender } = createLoopbackConnector();

const consumer = createConsumer(receiver());
const producer = createProducer(sender());

consumer.subscribe(msg => {
  console.log(`Received: "${msg.body}"`);
});

setInterval(() => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  const body = `(${hex}) Hello World!`;
  console.log(`Sending: "${body}"`);
  producer.next({
    body,
    to: 'hello'
  });
}, 2000);
