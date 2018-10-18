const { createConsumer, createProducer } = require('../../build/src');
const { createLoopbackConnector } = require('../../build/src/loopback');

const { receiver, sender } = createLoopbackConnector();

const consumer = createConsumer(receiver());
const producer = createProducer(sender());

consumer.subscribe(msg => {
  console.log(`Received: "${msg.content}"`);
});

setInterval(() => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  const content = `(${hex}) Hello World!`;
  console.log(`Sending: "${content}"`);
  producer.next({
    content,
    route: 'hello'
  });
}, 2000);
