const { createLoopbackConnector } = require('../../build/src/loopback');
const {
  createEventEmitter,
  createProducer,
  createConsumer
} = require('../../build/src');
const uuid = require('uuid/v4');

const { receiver, sender } = createLoopbackConnector();
const emitter = createEventEmitter({ sender: sender(), receiver: receiver() });

function sendRequest(name, payload) {
  return new Promise((res, rej) => {
    const correlationId = uuid();
    const replyTo = uuid();
    emitter.on(replyTo, ({ correlationId: corrId, content }) => {
      if (corrId === correlationId) {
        res(content);
      }
    });
    emitter.emit(name, { content: payload, replyTo, correlationId });
  });
}

function onRequest(name, process) {
  emitter.on(name, ({ correlationId, replyTo, content }) => {
    emitter.emit(replyTo, { correlationId, content: process(content) });
  });
}

onRequest('foo', greeting => {
  return `${greeting} World!`;
});

sendRequest('foo', 'Hello').then(response => {
  console.log(response);
});
