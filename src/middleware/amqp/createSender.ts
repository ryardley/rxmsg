import { Observable, Subscription } from 'rxjs';
import Logger from '../../logger';
import { Middleware } from '../../types';
import { assertDeclarations } from './assertions';
import {
  AmqpDeclarations,
  AmqpEngine,
  AmqpEngineFactory,
  AmqpMessageOut,
  RouteDescription
} from './types';

const log = new Logger({ label: 'createSender' });

function serializeMessage(message: string) {
  return JSON.stringify(message);
}

function getRouteValues(
  route: RouteDescription
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
  createChannel: AmqpEngineFactory,
  declarations: AmqpDeclarations,
  stream: Observable<AmqpMessageOut>
) {
  let subscription: Subscription;

  const setupChannel = async (channel: AmqpEngine) => {
    await assertDeclarations(channel, declarations);

    // subscribe on next tick so channel is ready
    setTimeout(async () => {
      // ensure we are not already on a subscription
      await tearDownChannel();

      subscription = stream.subscribe(({ route, ...msg }) => {
        const { exchange, key } = getRouteValues(route);

        // TODO: Perhaps give this a special verbose logging key
        log.info(`Publishing message: ${JSON.stringify(msg)}`);

        const content = serializeMessage(msg.content);

        if (!channel.publish(exchange, key, Buffer.from(content))) {
          log.error('channel write buffer is full!');
        }
      });
    }, 0);
    return channel;
  };

  const tearDownChannel = () => {
    if (subscription) {
      subscription.unsubscribe();
    }
    return Promise.resolve();
  };

  return createChannel(setupChannel, tearDownChannel).catch(err => {
    log.error('Could not create channel.', err);
  });
}

type CreateSender = (
  engineCreator: AmqpEngineFactory,
  config: AmqpDeclarations
) => () => Middleware<AmqpMessageOut>;

// Forward messages
const createSender: CreateSender = (
  engineCreator,
  config
) => (/* senderConfig*/) => {
  // We're all configured return the middleware
  return function messageOutMiddleware(stream) {
    setupSender(engineCreator, config, stream).catch(err => {
      log.error(err);
    });

    return stream;
  };
};

export default createSender;
