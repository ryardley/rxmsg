// tslint:disable:no-console
import { Observable } from 'rxjs';

import { assertDeclarations } from './assertions';
import createChannel from './createChannel';
import { IAmqpConfig, IAmqpMessageOut, IAmqpRoute } from './types';

function getRouteValues(route: IAmqpRoute): { exchange: string; key: string } {
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
  config: IAmqpConfig,
  stream: Observable<IAmqpMessageOut>
) {
  const channel = await createChannel(config);
  await assertDeclarations(channel, config.declarations);

  setTimeout(() => {
    stream.subscribe(({ route, ...msg }) => {
      const { exchange, key } = getRouteValues(route);
      const content = JSON.stringify(msg.content);

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
}

// Forward messages
const createSender = (config: IAmqpConfig) => () => (
  stream: Observable<IAmqpMessageOut>
) => {
  setupSender(config, stream).catch((e: Error) => {
    throw e;
  });

  return stream;
};
export default createSender;
