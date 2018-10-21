require('dotenv').config();

module.exports.amqpConfig = {
  declarations: {
    queues: [
      {
        durable: false,
        name: 'hello'
      },
      {
        durable: false,
        name: 'rpc_queue'
      }
    ]
  },
  uri: process.env.RABBIT_URI
};
