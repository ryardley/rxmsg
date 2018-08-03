// tslint:disable:no-console
import { Channel } from 'amqplib';

import {
  IRabbitBinding,
  IRabbitDeclarations,
  IRabbitExchange,
  IRabbitQueue
} from './domain';

export function enrichQueue(queueOrString: IRabbitQueue) {
  return typeof queueOrString === 'string'
    ? {
        name: queueOrString
      }
    : queueOrString;
}

function enrichBinding(binding: IRabbitBinding) {
  const {
    arguments: args = {},
    destination = '',
    pattern = '',
    source,
    type = 'queue'
  } = binding;
  return {
    arguments: args, // TODO fix this
    destination,
    pattern,
    source,
    type
  };
}

export function containsQueue(array: IRabbitQueue[] = [], queue: IRabbitQueue) {
  (array || []).find(
    item => enrichQueue(item).name === enrichQueue(queue).name
  );
}

export async function assertQueue(channel: Channel, queue: IRabbitQueue) {
  const { name, ...opts } = enrichQueue(queue);
  console.log(`Asserting queue: ${JSON.stringify({ name, opts })}`);
  return channel.assertQueue(name, opts);
}

export async function assertQueues(channel: Channel, queues: IRabbitQueue[]) {
  return Promise.all(queues.map(queue => assertQueue(channel, queue)));
}

export async function assertExchanges(
  channel: Channel,
  exchanges: IRabbitExchange[]
) {
  return Promise.all(
    exchanges.map(({ name, type, ...opts }) => {
      console.log(
        `Asserting exchanges: ${JSON.stringify({ name, type, opts })}`
      );
      return channel.assertExchange(name, type, opts);
    })
  );
}

export async function assertBindings(
  channel: Channel,
  bindings: IRabbitBinding[],
  defaultQueue: string
) {
  return Promise.all(
    bindings
      .map(enrichBinding)
      .map(({ arguments: args, destination, pattern, source, type }) => {
        const func = {
          exchange: channel.bindExchange.bind(channel),
          queue: channel.bindQueue.bind(channel)
        }[type];
        return func(destination || defaultQueue, source, pattern, args);
      })
  );
}

export async function assertDeclarations(
  channel: Channel,
  declarations: IRabbitDeclarations
) {
  const { queues = [], exchanges = [] } = declarations;
  return Promise.all([
    assertQueues(channel, queues),
    assertExchanges(channel, exchanges)
  ]);
}
