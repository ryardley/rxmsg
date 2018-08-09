// tslint:disable:no-console
import { Observable, Observer } from 'rxjs';
import {
  assertBindings,
  assertDeclarations,
  assertIfAnonymousQueue
} from './assertions';

import {
  IAmqpDeclarations,
  IAmqpEngineFactory,
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
  const channel = await createChannel();

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
      const { noAck } = receiverConfig;
      const ack = noAck
        ? () => {} // tslint:disable-line:no-empty
        : (allUpTo: boolean = false) => channel.ack(msg, allUpTo);

      // prepare content
      const content = deserialiseMessage(msg.content.toString());
      const { fields } = msg;
      // send
      observer.next({
        ack,
        content,
        route: {
          exchange: fields.exchange,
          key: fields.routingKey
        }
      });
    },
    receiverConfig
  );
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
