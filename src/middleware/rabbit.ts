import amqp from 'amqplib';
import { Observable, Observer } from 'rxjs';
import { IMessage, MiddlewareCreator } from '../domain';
// TODO: I think we need some way to declaratively specify the exchange structure

function log(msg) {
  console.log(msg); // tslint:disable-line
}

interface IRabbitConfig {
  uri: string;
  queue: string;
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

// TODOL: Listen for process kill and disconnect
async function createChannel(config: IRabbitConfig) {
  const conn = await getConnection(config);
  return await conn.createChannel();
}

// Forward messages
const createSender: MiddlewareCreator<IRabbitConfig> = config => (
  stream: Observable<IMessage>
) => {
  // TODO: How do we handle memory leaks wrt subscriptions
  createChannel(config)
    .then((channel: amqp.Channel) => {
      stream.subscribe(({ dest, ...msg }) => {
        log('Sending ' + JSON.stringify(msg));
        // const exchange = (dest && dest.exchange) || '';
        const exchange = ''; // for now leave this as empty
        const queue = (dest && dest.queue) || '';

        channel.assertQueue(queue, { durable: true });

        // if (exchange) {
        //   channel.assertExchange(exchange, '');
        // }
        channel.publish(
          exchange,
          queue,
          new Buffer(JSON.stringify(msg.payload))
        );
      });
    })
    .catch(e => log(e));

  return stream;
};

// Recieve messages
const createReceiver: MiddlewareCreator<IRabbitConfig> = config => () => {
  // TODO: need to carefully think about error handling scenarios
  // TODO: perhaps we need to have different message types for sending and
  //       recieving as reieving will have ack callbacks
  return Observable.create((observer: Observer<IMessage>) => {
    createChannel(config)
      .then(channel => {
        // how are we configuring queue?
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
          }
          // { noAck: false }
        );
      })
      .catch(e => log(e));
  });
};

export default (c?: IRabbitConfig) => ({
  receiver: createReceiver(c),
  sender: createSender(c)
});
