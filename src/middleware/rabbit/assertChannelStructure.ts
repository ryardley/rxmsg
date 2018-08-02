import { Channel } from 'amqplib';
import flatten from 'lodash/flatten';
import { IRabbitBinding, IRabbitQueue, IRabbitStructure } from './domain';

function castToQueue(queueOrString: IRabbitQueue | string): IRabbitQueue {
  return typeof queueOrString === 'string'
    ? { name: queueOrString }
    : queueOrString;
}

export default function assertChannelStructure(
  channel: Channel,
  structure: IRabbitStructure
) {
  const { queues, exchanges, bindings = [] } = structure;
  // TODO: currently it is a known issue we cannot do patterns with anonimous queues
  return Promise.all(
    flatten(
      [
        queues &&
          queues
            .map(castToQueue)
            .map(({ name, ...opts }) => channel.assertQueue(name, opts)),
        exchanges &&
          exchanges.map(({ name, type, ...opts }) =>
            channel.assertExchange(name, type, opts)
          ),
        bindings &&
          bindings.map(({ destination, source, pattern, type, arguments }) => {
            // Switch between exchange and queue bindFunc
            const bindFunc = {
              exchange: channel.bindExchange,
              queue: channel.bindQueue
            }[type];

            // if dest is object create destination

            return bindFunc(destination, source, pattern, arguments);
          })
      ].filter(Boolean)
    )
  );
}
