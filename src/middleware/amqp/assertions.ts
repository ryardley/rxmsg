import {
  AmqpDeclarations,
  AmqpEngine,
  BindingDescription,
  ExchangeDescription,
  QueueDescription,
  QueueShortDescription
} from './types';

export function enrichQueue(
  queueOrString: QueueShortDescription
): QueueDescription {
  return typeof queueOrString === 'string'
    ? {
        exclusive: true,
        name: queueOrString
      }
    : queueOrString;
}

function enrichBinding(binding: BindingDescription) {
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
  array: QueueShortDescription[] = [],
  queue: QueueShortDescription
) {
  array.find(item => enrichQueue(item).name === enrichQueue(queue).name);
}

export async function assertQueue(
  channel: AmqpEngine,
  queue: QueueShortDescription
) {
  const { name, ...opts } = enrichQueue(queue);
  return channel.assertQueue(name, opts);
}

export async function assertQueues(
  channel: AmqpEngine,
  queues: QueueShortDescription[]
) {
  return Promise.all(queues.map(queue => assertQueue(channel, queue)));
}

export async function assertExchanges(
  channel: AmqpEngine,
  exchanges: ExchangeDescription[]
) {
  return Promise.all(
    exchanges.map(({ name, type, ...opts }) => {
      return channel.assertExchange(name, type, opts);
    })
  );
}

export async function assertIfAnonymousQueue(
  channel: AmqpEngine,
  queue: string
) {
  if (queue !== '') {
    return queue; // assume this already exists
  }

  const serverResponse = await assertQueue(channel, queue);
  return serverResponse.queue;
}

export function assertBindings(
  channel: AmqpEngine,
  bindings: BindingDescription[],
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
  channel: AmqpEngine,
  declarations: AmqpDeclarations
) {
  const { queues = [], exchanges = [] } = declarations;
  return Promise.all([
    assertQueues(channel, queues),
    assertExchanges(channel, exchanges)
  ]);
}
