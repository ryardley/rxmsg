// tslint:disable:no-console
import { Observable } from 'rxjs';

import { Middleware } from '../../types';
import { assertDeclarations } from './assertions';
import {
  IAmqpDeclarations,
  IAmqpEngineFactory,
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
  createChannel(async channel => {
    await assertDeclarations(channel, declarations);

    setTimeout(() => {
      stream.subscribe(({ route, ...msg }) => {
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
    }, 500);
    return channel;
  });
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
