import { Observable, Observer } from 'rxjs';
import Logger from '../../logger';
import { Middleware } from '../../types';
import {
  assertBindings,
  assertDeclarations,
  assertIfAnonymousQueue
} from './assertions';
import {
  IAmqpDeclarations,
  IAmqpEngine,
  IAmqpEngineFactory,
  IAmqpEngineMessage,
  IAmqpEngineSetupFunction,
  IAmqpMessageIn,
  IAmqpReceiverDescription
} from './types';

const log = new Logger({ label: 'createReceiver' });

function deserialiseMessage(possiblySerialisedMessage: string) {
  try {
    return JSON.parse(possiblySerialisedMessage);
  } catch (e) {
    return possiblySerialisedMessage;
  }
}

function createAck(
  noAck: boolean,
  channel: IAmqpEngine,
  msg: IAmqpEngineMessage
) {
  return noAck
    ? () => {} // tslint:disable-line:no-empty
    : (allUpTo: boolean = false) => channel.ack(msg, allUpTo);
}

async function setupReceiver(
  createChannel: IAmqpEngineFactory,
  declarations: IAmqpDeclarations,
  localConfig: IAmqpReceiverDescription,
  observer: Observer<IAmqpMessageIn>
) {
  const {
    queue = '',
    prefetch,
    bindings = [],
    ...receiverConfig
  } = localConfig;

  const setupChannel: IAmqpEngineSetupFunction = async channel => {
    // setup structure
    await assertDeclarations(channel, declarations);
    const consumptionQueue = await assertIfAnonymousQueue(channel, queue);
    await assertBindings(channel, bindings, consumptionQueue);

    // Prefetch is set
    if (typeof prefetch === 'number') {
      channel.prefetch(prefetch);
    }

    // consume the channel
    channel
      .consume(
        consumptionQueue,
        msg => {
          if (!msg) {
            log.error('Received null message. Setting up channel again...');
            setupChannel(channel);
            return;
          }

          // handle acknowledgement
          const { noAck = false } = receiverConfig;

          // prepare content
          const {
            fields: { exchange, routingKey: key },
            content
          } = msg;

          // send
          observer.next({
            ack: createAck(noAck, channel, msg),
            content: deserialiseMessage(content.toString()),
            route: { exchange, key }
          });
        },
        receiverConfig
      )
      .catch(err => {
        log.error(err);
      });

    return channel;
  };

  const tearDownChannel = () => {
    // TODO: Do we need to get channelTag and close channel?
    return Promise.resolve();
  };

  createChannel(setupChannel, tearDownChannel).catch(err => {
    log.error('Could not create channel.', err);
  });
}

type CreateReceiver = (
  engineCreator: IAmqpEngineFactory,
  config: IAmqpDeclarations
) => (r: IAmqpReceiverDescription) => Middleware<IAmqpMessageIn>;

// Recieve messages
const createReceiver: CreateReceiver = (
  engineCreator,
  config
) => receiverConfig => {
  // We're all configured return the middleware
  return function messageInMiddleware(/* dummyStream */) {
    return Observable.create((observer: Observer<IAmqpMessageIn>) => {
      setupReceiver(engineCreator, config, receiverConfig, observer).catch(
        err => {
          log.error(`Error setting up message receiver: ${err}`);
        }
      );
    });
  };
};

export default createReceiver;
