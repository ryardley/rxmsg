const { createConsumer } = require("rxjs-message");
const { createAmqpConnector } = require("rxjs-message/amqp");

require("dotenv").config();

const { receiver } = createAmqpConnector({
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

const consumer = createConsumer(
  receiver({
    noAck: true,
    queue: "hello"
  })
);

consumer.subscribe(msg => {
  // Check msg.content
  console.log(`Received: "${msg.content}"`);
});
