// import * as amqp from 'amqplib';
import * as amqp from 'amqp-connection-manager';
import * as amqplib from 'amqplib';
import { IAmqpEngine, IAmqpEngineConfigurator } from './types';

// This is done so we can easily mock engines
export const configureAmqpEngine: IAmqpEngineConfigurator = config => {
  // Return a channel creator
  return async setupFunc => {
    const { uri, socketOptions } = config;

    const connection = amqp.connect(
      [uri],
      { connectionOptions: socketOptions }
    );
    return new Promise<IAmqpEngine>(resolve => {
      const opts: amqp.CreateChannelOpts = {
        setup: async (channel: amqplib.ConfirmChannel) => {
          const engineChannel = {
            ack: channel.ack.bind(channel),
            assertExchange: channel.assertExchange.bind(channel),
            assertQueue: channel.assertQueue.bind(channel),
            bindExchange: channel.bindExchange.bind(channel),
            bindQueue: channel.bindQueue.bind(channel),
            closeConnection: () => {
              return connection.close();
            },
            consume: channel.consume.bind(channel),
            prefetch: channel.prefetch.bind(channel),
            publish: channel.publish.bind(channel)
          };

          resolve(setupFunc ? await setupFunc(engineChannel) : engineChannel);
        }
      };
      connection.createChannel(opts);
    });
  };
};
