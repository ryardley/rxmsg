// tslint:disable:no-console
import { Observable, Observer } from 'rxjs';
import {
  assertBindings,
  assertDeclarations,
  assertQueue,
  containsQueue,
  enrichQueue
} from './assertions';
import createChannel from './createChannel';

import {
  IRabbitConfig,
  IRabbitMessageConsumer,
  IRabbitReceiver
} from './domain';

async function setupReceiver(
  config: IRabbitConfig,
  { queue, prefetch, bindings = [], ...receiverConfig }: IRabbitReceiver,
  observer: Observer<IRabbitMessageConsumer>
) {
  console.log(JSON.stringify({ queue, prefetch, receiverConfig }));
  const channel = await createChannel(config);
  await assertDeclarations(channel, config.declarations);

  // TODO this is clumsy and needs fixing
  let queueName: string;
  if (!containsQueue(config.declarations.queues, queue)) {
    // TODO: fix naming
    const { queue: queueString } = await assertQueue(channel, queue);
    queueName = queueString;
  } else {
    queueName = enrichQueue(queue).name;
  }

  await assertBindings(channel, bindings, queueName);

  // Prefetch is set
  if (typeof prefetch === 'number') {
    channel.prefetch(prefetch);
  }

  // consume the channel
  channel.consume(
    queueName,
    msg => {
      const rxMsg: IRabbitMessageConsumer = {
        ack: !receiverConfig.noAck
          ? (allUpTo: boolean = false) => channel.ack(msg, allUpTo)
          : undefined,
        content: JSON.parse(msg.content.toString())
      };
      console.log('got message!');
      observer.next(rxMsg);
    },
    receiverConfig
  );
}

// Recieve messages
const createReceiver = (config: IRabbitConfig) => (
  receiverConfig: IRabbitReceiver
) => () => {
  return Observable.create((observer: Observer<IRabbitMessageConsumer>) => {
    setupReceiver(config, receiverConfig, observer).catch(e => {
      throw e;
    });
  });
};

export default createReceiver;
