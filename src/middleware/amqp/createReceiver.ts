// tslint:disable:no-console
import { Observable, Observer } from 'rxjs';
import {
  assertBindings,
  assertDeclarations,
  assertIfAnonymousQueue
} from './assertions';
import createChannel from './createChannel';

import { IAmqpConfig, IAmqpMessageConsumed, IAmqpReceiver } from './types';

async function setupReceiver(
  config: IAmqpConfig,
  localConfig: IAmqpReceiver,
  observer: Observer<IAmqpMessageConsumed>
) {
  const {
    queue = '',
    prefetch,
    bindings = [],
    ...receiverConfig
  } = localConfig;

  const channel = await createChannel(config);
  if (!channel) {
    return;
  }
  await assertDeclarations(channel, config.declarations);
  const consumptionQueue = await assertIfAnonymousQueue(channel, queue);
  await assertBindings(channel, bindings, consumptionQueue);

  // Prefetch is set
  if (typeof prefetch === 'number') {
    channel.prefetch(prefetch);
  }

  // consume the channel
  channel.consume(
    consumptionQueue,
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
const createReceiver = (config: IAmqpConfig) => (
  receiverConfig: IAmqpReceiver
) => () => {
  return Observable.create((observer: Observer<IAmqpMessageConsumed>) => {
    setupReceiver(config, receiverConfig, observer).catch(e => {
      throw e;
    });
  });
};

export default createReceiver;
