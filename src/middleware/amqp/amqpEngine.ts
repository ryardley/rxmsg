/* tslint:disable:no-console */
// import * as amqp from 'amqplib';
import * as amqp from 'amqp-connection-manager';
import * as amqplib from 'amqplib';
import {
  IAmqpEngine,
  IAmqpEngineConfigurator,
  IAmqpEngineSetup
} from './types';

function ensureArray(possibleArray: string[] | string): string[] {
  return Array.isArray(possibleArray) ? possibleArray : [possibleArray];
}

function createEngine(
  channel: amqplib.ConfirmChannel,
  connection: amqp.AmqpConnectionManager
) {
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

function setupEngine(
  connection: amqp.AmqpConnectionManager,
  setupFunc: IAmqpEngineSetup
) {
  return new Promise<IAmqpEngine>(resolve => {
    connection.createChannel({
      setup(channel: amqplib.ConfirmChannel) {
        console.log('   -> RUNNING SETUP');
        setupFunc(createEngine(channel, connection)).then(resolve);
      }
    });
  });
}

// This is done so we can easily mock engines
export const configureAmqpEngine: IAmqpEngineConfigurator = config => {
  // Return a channel creator
  return function channelCreator(
    setupFunc = Promise.resolve,
    tearDown = Promise.resolve
  ) {
    const { uri, socketOptions: connectionOptions } = config;

    const connection = amqp.connect(
      ensureArray(uri),
      { connectionOptions }
    );

    connection.on('connect', () => {
      console.log('   -> RUNNING CONNECT');
      console.log('Connected!');
    });

    connection.on('disconnect', async params => {
      await tearDown();
      console.log('   -> RUNNING DISCONNECT');
      console.log('Disconnected.', params.err.stack);
    });

    return setupEngine(connection, setupFunc);
  };
};
