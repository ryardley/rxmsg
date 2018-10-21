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
        noAck: true,
        onReady: ({ consumptionQueue }) => {
          producer.next({
            body: question,
            to: 'favouriteVegetable',
            replyTo: consumptionQueue,
            correlationId
          });
        }
      })
    );
    const subscription = consumer.subscribe(msg => {
      if (msg.correlationId === correlationId) {
        resolve(msg.body);
        setTimeout(() => {
          subscription.unsubscribe();
          process.exit(0);
        }, 1000);
      }
    });
  });
}

getFavouriteVegetable('green').then(answer => {
  console.log(`answer:${answer}`);
});

getFavouriteVegetable('purple').then(answer => {
  console.log(`answer:${answer}`);
});
