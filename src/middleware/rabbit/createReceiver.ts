// tslint:disable:no-console
import { Observable, Observer } from 'rxjs';
import {
  assertBindings,
  assertDeclarations,
  assertQueue
  // containsQueue,
  // enrichQueue
} from './assertions';
import createChannel from './createChannel';

import {
  IRabbitConfig,
  IRabbitMessageConsumer,
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
  observer: Observer<IRabbitMessageConsumer>
) {
  console.log(
    JSON.stringify({ queue: bindingQueueName, prefetch, receiverConfig })
  );
  const channel = await createChannel(config);
  const decs = await assertDeclarations(channel, config.declarations);
  console.log(JSON.stringify({ decs }));
  let queue = bindingQueueName;
  if (bindingQueueName === '') {
    const serverResponse = await assertQueue(channel, bindingQueueName);
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
