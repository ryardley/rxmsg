// tslint:disable:no-console

import {
  IAmqpBinding,
  IAmqpDeclarations,
  IAmqpEngine,
  IAmqpExchangeDescription,
  IAmqpQueueDescription,
  IAmqpQueueShortDescription
} from './types';

export function enrichQueue(
  queueOrString: IAmqpQueueShortDescription
): IAmqpQueueDescription {
  return typeof queueOrString === 'string'
    ? {
        exclusive: true,
        name: queueOrString
      }
    : queueOrString;
}

function enrichBinding(binding: IAmqpBinding) {
  const {
    arguments: args,
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

export function containsQueue(
  array: IAmqpQueueShortDescription[] = [],
  queue: IAmqpQueueShortDescription
) {
  array.find(item => enrichQueue(item).name === enrichQueue(queue).name);
}

export async function assertQueue(
  channel: IAmqpEngine,
  queue: IAmqpQueueShortDescription
) {
  const { name, ...opts } = enrichQueue(queue);
  return channel.assertQueue(name, opts);
}

export async function assertQueues(
  channel: IAmqpEngine,
  queues: IAmqpQueueShortDescription[]
) {
  return Promise.all(queues.map(queue => assertQueue(channel, queue)));
}

export async function assertExchanges(
  channel: IAmqpEngine,
  exchanges: IAmqpExchangeDescription[]
) {
  return Promise.all(
    exchanges.map(({ name, type, ...opts }) => {
      return channel.assertExchange(name, type, opts);
    })
  );
}

export async function assertIfAnonymousQueue(
  channel: IAmqpEngine,
  queue: string
) {
  if (queue !== '') {
    return queue; // assume this already exists
  }

  const serverResponse = await assertQueue(channel, queue);
  return serverResponse.queue;
}

export function assertBindings(
  channel: IAmqpEngine,
  bindings: IAmqpBinding[],
  defaultQueue: string
) {
  return Promise.all(
    bindings
      .map(enrichBinding)
      .map(({ arguments: args, destination, pattern, source, type }) => {
        const dest = destination || defaultQueue;
        const func = {
          exchange: channel.bindExchange,
          queue: channel.bindQueue
        }[type];
        return func(dest, source, pattern, args);
      })
  ).catch(e => {
    throw e;
  });
}

export async function assertDeclarations(
  channel: IAmqpEngine,
  declarations: IAmqpDeclarations
) {
  const { queues = [], exchanges = [] } = declarations;
  return Promise.all([
    assertQueues(channel, queues),
    assertExchanges(channel, exchanges)
  ]);
}
