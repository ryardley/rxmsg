// tslint:disable:no-console
import { Observable, Subscription } from 'rxjs';

import { Middleware } from '../../types';
import { assertDeclarations } from './assertions';
import {
  IAmqpDeclarations,
  IAmqpEngineFactory,
  IAmqpEngineSetup,
  IAmqpMessageOut,
  IAmqpRouteDescription
} from './types';

function serializeMessage(message: string) {
  return JSON.stringify(message);
}

function getRouteValues(
  route: IAmqpRouteDescription
): { exchange: string; key: string } {
  return typeof route === 'string'
    ? {
        exchange: '',
        key: route
      }
    : {
        exchange: route.exchange,
        key: route.key || ''
      };
}

async function setupSender(
  createChannel: IAmqpEngineFactory,
  declarations: IAmqpDeclarations,
  stream: Observable<IAmqpMessageOut>
) {
  let subscription: Subscription;
  const setupChannel: IAmqpEngineSetup = async channel => {
    await assertDeclarations(channel, declarations);

    // subscribe on next tick so channel is ready
    setTimeout(() => {
      subscription = stream.subscribe(({ route, ...msg }) => {
        const { exchange, key } = getRouteValues(route);
        const content = serializeMessage(msg.content);
        if (!channel.publish(exchange, key, Buffer.from(content))) {
          // Do we throw an error here? What should we do here when the
          // publish queue needs draining?
          console.log(
            `Error publishing: ${JSON.stringify({
              content,
              exchange,
              key
            })}`
          );
        }
      });
    }, 0);
    return channel;
  };

  const tearDownChannel = () => Promise.resolve(subscription.unsubscribe());
  createChannel(setupChannel, tearDownChannel);
}

type CreateSender = (
  engineCreator: IAmqpEngineFactory,
  config: IAmqpDeclarations
) => () => Middleware<IAmqpMessageOut>;

// Forward messages
const createSender: CreateSender = (engineCreator, config) => () => stream => {
  setupSender(engineCreator, config, stream).catch((e: Error) => {
    throw e;
  });

  return stream;
};

export default createSender;
