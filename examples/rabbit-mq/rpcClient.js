const { createConsumer, createProducer } = require('../../build/src');
const { createAmqpConnector } = require('../../build/src/amqp');
const { amqpConfig } = require('./amqpConfig');
const uuid = require('uuid/v4');
const connector = createAmqpConnector(amqpConfig);

const producer = createProducer(connector.sender());

async function getFavouriteVegetable(question) {
  return new Promise((resolve, reject) => {
    const correlationId = uuid();

    const consumer = createConsumer(
      connector.receiver({
        onReady: ({ consumptionQueue }) => {
          producer.next({
            body: question,
            to: 'rpc_queue',
            replyTo: consumptionQueue,
            correlationId
          });
        }
      })
    );
    const subscription = consumer.subscribe(msg => {
      msg.ack();
      if (msg.correlationId === correlationId) {
        subscription.unsubscribe();
        resolve(msg.body);
      }
    });
  });
}

getFavouriteVegetable('Hello').then(answer => {
  console.log(answer);
  process.exit(0);
});
