import amqp from 'amqplib';
import { Observable, Observer } from 'rxjs';
import { IMessage, MiddlewareCreator } from '../domain';

// TODO: I think we need some way to declaratively specify the exchange structure

interface IRabbitConfig {
  uri: string;
  queue?: string;
  socketOptions?: {
    noDelay?: boolean;
    cert?: Buffer;
    key?: Buffer;
    passphrase?: string;
    ca?: Buffer[];
  };
}

function throwConnectionError(err: Error) {
  throw new Error(`Rabbit middleware could not connect to RabbitMQ. ${err}`);
}

async function createConnection(config: IRabbitConfig) {
  const { uri, socketOptions } = config;
  try {
    return await amqp.connect(
      uri,
      socketOptions
    );
  } catch (err) {
    throwConnectionError(err);
  }
}

// we only need a single TCP connection per node and can use channels
let singletonConn: amqp.Connection;
async function getConnection(config: IRabbitConfig) {
  if (!singletonConn) {
    try {
      singletonConn = await createConnection(config);
    } catch (err) {
      throwConnectionError(err);
    }
  }
  return singletonConn;
}

async function createChannel(config: IRabbitConfig) {
  const conn = await getConnection(config);
  return await conn.createChannel();
}

// Forward messages
const createSender: MiddlewareCreator<IRabbitConfig> = config => (
  stream: Observable<IMessage>
) => {
  // TODO: How do we handle memory leaks wrt subscriptions
  createChannel(config).then((channel: amqp.Channel) => {
    stream.subscribe(({ dest, ...msg }) => {
      const exchange = (dest && dest.exchange) || '';
      const queue = (dest && dest.queue) || '';
      channel.publish(exchange, queue, new Buffer(JSON.stringify(msg.payload)));
    });
  });

  return stream;
};

// Recieve messages
const createReceiver: MiddlewareCreator<IRabbitConfig> = config => () => {
  // TODO: need to carefully think about error handling scenarios
  // TODO: perhaps we need to have different message types for sending and
  //       recieving as reieving will have ack callbacks
  return Observable.create((observer: Observer<IMessage>) => {
    createChannel(config).then(channel => {
      channel.assertQueue(config.queue, { durable: true });
      channel.consume(
        config.queue,
        msg => {
          const payload = JSON.parse(msg.content.toString());
          const ack = () => channel.ack(msg);
          observer.next({
            ack, // ack's must be called after the consumer has finished with the message
            payload
          });
        },
        { noAck: false }
      );
    });
  });
};

export default (c?: IRabbitConfig) => ({
  receiver: createReceiver(c),
  sender: createSender(c)
});
