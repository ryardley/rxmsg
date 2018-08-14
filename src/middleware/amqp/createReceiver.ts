// tslint:disable:no-console
import { Observable, Observer } from 'rxjs';
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
  IAmqpEngineSetup,
  IAmqpMessageIn,
  IAmqpReceiverDescription
} from './types';

import { Middleware } from '../../types';

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

  const setupChannel: IAmqpEngineSetup = async channel => {
    // setup structure
    await assertDeclarations(channel, declarations);
    const consumptionQueue = await assertIfAnonymousQueue(channel, queue);
    await assertBindings(channel, bindings, consumptionQueue);

    // Prefetch is set
    if (typeof prefetch === 'number') {
      channel.prefetch(prefetch);
    }

    // consume the channel
    channel.consume(
      consumptionQueue,
      msg => {
        // Technically it is possible that amqplib consumes with a null msg
        if (!msg) {
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
    );

    return channel;
  };

  createChannel(setupChannel);
}

type CreateReceiver = (
  engineCreator: IAmqpEngineFactory,
  config: IAmqpDeclarations
) => (r: IAmqpReceiverDescription) => Middleware<IAmqpMessageIn>;

// Recieve messages
const createReceiver: CreateReceiver = (
  engineCreator,
  config
) => receiverConfig => () =>
  Observable.create((observer: Observer<IAmqpMessageIn>) => {
    setupReceiver(engineCreator, config, receiverConfig, observer).catch(e => {
      throw e;
    });
  });

export default createReceiver;
