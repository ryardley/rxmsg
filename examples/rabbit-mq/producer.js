const { createProducer } = require("rxjs-message");
const { createAmqpConnector } = require("rxjs-message/amqp");

require("dotenv").config();

const { sender } = createAmqpConnector({
  declarations: {
    queues: [
      {
        durable: false,
        name: "hello"
      }
    ]
  },
  uri: process.env.RABBIT_URI
});

const producer = createProducer(sender());

setInterval(() => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  producer.next({
    content: `(${hex}) Hello World!`,
    route: "hello"
  });
}, 2000);
