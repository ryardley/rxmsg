require('dotenv').config();

module.exports.amqpConfig = {
  declarations: {
    queues: [
      {
        durable: false,
        name: 'hello'
      }
    ]
  },
  uri: process.env.RABBIT_URI
};
