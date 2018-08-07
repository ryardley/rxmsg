import amqp from 'amqplib';
import { IAmqpConfig } from './domain';

function throwConnectionError(err: Error) {
  throw new Error(`Rabbit middleware could not connect to RabbitMQ. ${err}`);
}

// TODO: use a WeakMap() to manage connections

async function createConnection(
  config: IAmqpConfig
): Promise<amqp.Connection | undefined> {
  const { uri, socketOptions } = config;
  let conn;
  try {
    conn = await amqp.connect(
      uri,
      socketOptions
    );
  } catch (err) {
    throwConnectionError(err);
  }
  return conn;
}

// TODO: fix concurrent connections issue need to lock this function until
// promise has resolved and should return same promise while it is resolving

// we only need a single TCP connection per node and can use channels
let singletonConn: amqp.Connection | undefined;
export async function getConnection(
  config: IAmqpConfig
): Promise<amqp.Connection | undefined> {
  if (!singletonConn) {
    try {
      singletonConn = await createConnection(config);
    } catch (err) {
      throwConnectionError(err);
    }
  }
  return singletonConn;
}

export async function closeConnection(config: IAmqpConfig) {
  const conn = await getConnection(config);
  if (conn) {
    return await conn.close();
  }
}

// TODO: Listen for process kill and disconnect? Maybe this happens automatically
export default async function createChannel(config: IAmqpConfig) {
  const conn = await getConnection(config);
  if (conn) {
    return await conn.createChannel();
  }
}
