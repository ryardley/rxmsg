import amqp from 'amqplib';
import flatten from 'lodash/flatten';
import { IBroker, IRabbitBinding } from './domain';

export default function assertChannelStructure(
  channel: amqp.Channel,
  broker: IBroker
) {
  const { queues = [], exchanges = [], bindings = [] } = broker;
  return Promise.all(
    flatten([
      Object.entries(queues).map(([name, queueOptions]) =>
        channel.assertQueue(name, queueOptions)
      ),
      Object.entries(exchanges).map(([name, { type, ...exchangeOptions }]) =>
        channel.assertExchange(name, type, exchangeOptions)
      ),
      bindings.map(
        ({ destination, source, pattern, type, args }: IRabbitBinding) => {
          // Switch between exchange and queue
          const bindFunc = {
            exchange: channel.bindExchange,
            queue: channel.bindQueue
          }[type];

          return bindFunc(destination, source, pattern, args);
        }
      )
    ])
  );
}
