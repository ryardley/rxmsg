// tslint:disable:no-console
import { Observable, Observer } from 'rxjs';
import { assertBindings, assertDeclarations, assertQueue } from './assertions';
import createChannel from './createChannel';

import {
  IRabbitConfig,
  IRabbitMessageConsumed,
  IRabbitReceiver
} from './domain';

async function setupReceiver(
  config: IRabbitConfig,
  {
    queue: bindingQueueName,
    prefetch,
    bindings = [],
    ...receiverConfig
  }: IRabbitReceiver,
  observer: Observer<IRabbitMessageConsumed>
) {
  const channel = await createChannel(config);

  await assertDeclarations(channel, config.declarations);

  let queue = bindingQueueName || '';
  if (queue === '') {
    const serverResponse = await assertQueue(channel, queue);
    queue = serverResponse.queue;
  }

  await assertBindings(channel, bindings, queue);

  // Prefetch is set
  if (typeof prefetch === 'number') {
    channel.prefetch(prefetch);
  }

  // consume the channel
  channel.consume(
    queue,
    msg => {
      // handle acknowledgement
      const { noAck } = receiverConfig;
      const ack = noAck
        ? () => {} // tslint:disable-line:no-empty
        : (allUpTo: boolean = false) => channel.ack(msg, allUpTo);

      // prepare content
      const content = JSON.parse(msg.content.toString());
      const { fields } = msg;
      // send
      observer.next({
        ack,
        content,
        route: {
          exchange: fields.exchange,
          key: fields.routingKey
        }
      });
    },
    receiverConfig
  );
}

// Recieve messages
const createReceiver = (config: IRabbitConfig) => (
  receiverConfig: IRabbitReceiver
) => () => {
  return Observable.create((observer: Observer<IRabbitMessageConsumed>) => {
    setupReceiver(config, receiverConfig, observer).catch(e => {
      throw e;
    });
  });
};

export default createReceiver;
