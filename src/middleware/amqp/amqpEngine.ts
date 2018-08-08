import * as amqp from 'amqplib';
import { IAmqpEngineConfigurator } from './types';

// TODO: use a WeakMap() to manage connections
let singletonConnection: amqp.Connection;
const closeConnection = async () => {
  return singletonConnection
    ? await singletonConnection.close()
    : Promise.resolve();
};

// TODO: fix concurrent connections issue need to lock this function until
// promise has resolved and should return same promise while it is resolving

// we only need a single TCP connection per node and can use channels
const ensureConnection = async (uri: string, socketOptions?: any) => {
  if (!singletonConnection) {
    singletonConnection = await amqp.connect(
      uri,
      socketOptions
    );
  }

  return singletonConnection;
};

// This is done so we can easily mock engines
export const configureAmqpEngine: IAmqpEngineConfigurator = config => {
  // Return a channel creator
  return async () => {
    const { uri, socketOptions } = config;
    await ensureConnection(uri, socketOptions);
    const channel = await singletonConnection.createChannel();
    // TODO: Listen for process kill and disconnect? Maybe this happens automatically

    return {
      ack: channel.ack.bind(channel),
      assertExchange: channel.assertExchange.bind(channel),
      assertQueue: channel.assertQueue.bind(channel),
      bindExchange: channel.bindExchange.bind(channel),
      bindQueue: channel.bindQueue.bind(channel),
      closeConnection,
      consume: channel.consume.bind(channel),
      prefetch: channel.prefetch.bind(channel),
      publish: channel.publish.bind(channel)
    };
  };
};
