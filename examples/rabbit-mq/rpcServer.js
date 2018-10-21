const { createConsumer, createProducer } = require('../../build/src');
const { createAmqpConnector } = require('../../build/src/amqp');
const { amqpConfig } = require('./amqpConfig');

const producer = createProducer(createAmqpConnector(amqpConfig).sender());

const consumer = createConsumer(
  createAmqpConnector(amqpConfig).receiver({
    noAck: true,
    queue: 'favouriteVegetable'
  })
);

consumer.subscribe(msg => {
  const { correlationId, replyTo, body } = msg;
  if (!replyTo) {
    return;
  }

  const returnMessage = {
    body: process(msg.body),
    to: replyTo,
    correlationId
  };

  producer.next(returnMessage);
});

function process(message) {
  return message === 'green' ? 'Brussel Sprouts' : 'Nope';
}
