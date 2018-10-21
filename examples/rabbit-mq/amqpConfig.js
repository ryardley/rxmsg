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
        name: 'favouriteVegetable'
      }
    ]
  },
  uri: process.env.RABBIT_URI
};
