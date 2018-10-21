import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';
import { Middleware } from '../../types';
import Logger from '../../utils/logger';
import {
  assertBindings,
  assertDeclarations,
  assertIfAnonymousQueue
} from './assertions';
import {
  AmqpDeclarations,
  AmqpEngine,
  AmqpEngineFactory,
  AmqpMessageIn,
  AmqpProtocolMessage,
  ReceiverDescription,
  ReceiverDescriptionSchema
} from './types';
import { createValidator } from './types/validator';

const log = new Logger({ label: 'createReceiver' });

const validateInput = createValidator<ReceiverDescription>(
  ReceiverDescriptionSchema
);

function deserialiseMessage(possiblySerialisedMessage: string) {
  try {
    return JSON.parse(possiblySerialisedMessage);
  } catch (e) {
    return possiblySerialisedMessage;
  }
}

function createAck(
  noAck: boolean,
  channel: AmqpEngine,
  msg: AmqpProtocolMessage
) {
  return noAck
    ? () => {} // tslint:disable-line:no-empty
    : (allUpTo: boolean = false) => channel.ack(msg, allUpTo);
}

async function setupReceiver(
  createChannel: AmqpEngineFactory,
  declarations: AmqpDeclarations,
  localConfig: ReceiverDescription,
  observer: Observer<AmqpMessageIn>
) {
  const {
    queue = '',
    prefetch,
    bindings = [],
    ...receiverConfig
  } = localConfig;

  const setupChannel = async (channel: AmqpEngine) => {
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
            body: deserialiseMessage(content.toString()),
            to: { exchange, key }
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
  engineCreator: AmqpEngineFactory,
  config: AmqpDeclarations
) => (r: ReceiverDescription) => Middleware<AmqpMessageIn>;

// Recieve messages
const createReceiver: CreateReceiver = (
  engineCreator,
  config
) => receiverConfig => {
  validateInput(receiverConfig);

  // We're all configured return the middleware
  return function messageInMiddleware(/* dummyStream */) {
    return Observable.create((observer: Observer<AmqpMessageIn>) => {
      setupReceiver(engineCreator, config, receiverConfig, observer).catch(
        err => {
          log.error(`Error setting up message receiver: ${err}`);
        }
      );
      return observer;
    }).pipe(share()); // ensure observable can be read by multiple clients on a single endpoint
  };
};

export default createReceiver;
