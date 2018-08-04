// tslint:disable:no-console
import { Observable } from 'rxjs';

import { assertDeclarations } from './assertions';
import createChannel from './createChannel';
import { IRabbitConfig, IRabbitMessageProducer, IRabbitRoute } from './domain';

function getRouteValues(
  route: IRabbitRoute
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
  config: IRabbitConfig,
  stream: Observable<IRabbitMessageProducer>
) {
  const channel = await createChannel(config);
  await assertDeclarations(channel, config.declarations);

  setTimeout(() => {
    stream.subscribe(({ route, meta, ...msg }) => {
      const { exchange, key } = getRouteValues(route);
      const content = JSON.stringify(msg.content);

      if (!channel.publish(exchange, key, Buffer.from(content), meta)) {
        // Do we throw an error here? What should we do here when the
        // publish queue needs draining?
        console.log(
          `Error publishing: ${JSON.stringify({
            content,
            exchange,
            key,
            meta
          })}`
        );
      }
    });
  }, 500);
}

// Forward messages
const createSender = (config: IRabbitConfig) => () => (
  stream: Observable<IRabbitMessageProducer>
) => {
  setupSender(config, stream).catch((e: Error) => {
    throw e;
  });

  return stream;
};
export default createSender;
