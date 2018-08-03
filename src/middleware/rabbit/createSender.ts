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
  stream.subscribe(({ route, meta, ...msg }) => {
    const { exchange, key } = getRouteValues(route);

    console.log(
      `gonna publish ${exchange}, ${key}, ${msg.content}, ${JSON.stringify(
        meta
      )}`
    );
    channel.publish(
      exchange,
      key,
      new Buffer(JSON.stringify(msg.content)),
      meta
    );
  });
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
