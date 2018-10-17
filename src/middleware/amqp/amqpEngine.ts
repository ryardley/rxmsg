// import * as amqp from 'amqplib';
import * as amqp from 'amqp-connection-manager';
import * as amqplib from 'amqplib';
import { AmqpEngine, AmqpEngineFactory, ConnectionDescription } from './types';

import Logger from '../../utils/logger';
const log = new Logger({ label: 'amqpEngine' });

function ensureArray(possibleArray: string[] | string): string[] {
  return Array.isArray(possibleArray) ? possibleArray : [possibleArray];
}

function createEngine(
  channel: amqplib.ConfirmChannel,
  connection: amqp.AmqpConnectionManager
): AmqpEngine {
  return {
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
}

// This is done so we can easily mock engines
export const configureAmqpEngine = (config: ConnectionDescription) => {
  // Return a channel creator
  const engineFactory: AmqpEngineFactory = (
    setupFunc = Promise.resolve,
    tearDown = Promise.resolve
  ) => {
    return new Promise<AmqpEngine>((resolve /*,reject*/) => {
      const { uri, socketOptions: connectionOptions } = config;

      const connection = amqp.connect(
        ensureArray(uri),
        { connectionOptions }
      );

      // TODO: Why not run setup here? I guess we would need to create out own channel...
      connection.on('connect', () => {
        log.info('Connected!');
      });

      connection.on('disconnect', async params => {
        await tearDown(params);
        log.error('Disconnected.');
      });

      connection.createChannel({
        setup(channel: amqplib.ConfirmChannel) {
          setupFunc(createEngine(channel, connection)).then(resolve);
        }
      });
    });
  };

  return engineFactory;
};
