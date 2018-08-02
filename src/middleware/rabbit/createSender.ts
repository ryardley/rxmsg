import amqp from 'amqplib';
import { Observable } from 'rxjs';
import { MiddlewareCreator } from '../../domain';
import assertChannelStructure from './assertChannelStructure';
import createChannel from './createChannel';
import { IRabbitConfig, IRabbitDestination, IRabbitMessage } from './domain';

// TODO: use a real logger
const log = console.log.bind(console); // tslint:disable-line

function castToObjectDestination(
  queueNameOrDestination: IRabbitDestination | string
): IRabbitDestination {
  if (typeof queueNameOrDestination === 'string') {
    return {
      exchange: '',
      routeKey: queueNameOrDestination
    };
  }
  return queueNameOrDestination;
}

// Forward messages
const createSender: MiddlewareCreator<IRabbitConfig> = config => (
  stream: Observable<IRabbitMessage>
) => {
  // TODO: How do we handle memory leaks wrt subscriptions?
  createChannel(config)
    .then((channel: amqp.Channel) => {
      // fix up all this promise crap
      assertChannelStructure(channel, config.declarations).then(() => {
        stream.subscribe(({ destination, ...msg }) => {
          log('Sending ' + JSON.stringify(msg));
          const { exchange, routeKey } = castToObjectDestination(destination);

          channel.publish(
            exchange,
            routeKey,
            new Buffer(JSON.stringify(msg.content))
          );
        });
      });
    })
    .catch(e => log(e));

  return stream;
};
export default createSender;
