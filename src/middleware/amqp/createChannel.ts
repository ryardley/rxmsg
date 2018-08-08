import { Connection } from 'amqplib';
import { IAmqp, IAmqpConfig } from './types';

// TODO: use a WeakMap() to manage connections

async function createConnection(
  amqp: IAmqp,
  config: IAmqpConfig
): Promise<Connection> {
  const { uri, socketOptions } = config;

  return await amqp.connect(
    uri,
    socketOptions
  );
}

// TODO: fix concurrent connections issue need to lock this function until
// promise has resolved and should return same promise while it is resolving

// we only need a single TCP connection per node and can use channels
let singletonConn: Connection | undefined;
export async function getConnection(
  amqp: IAmqp,
  config: IAmqpConfig
): Promise<Connection> {
  if (!singletonConn) {
    singletonConn = await createConnection(amqp, config);
  }
  return singletonConn;
}

export async function closeConnection(amqp: IAmqp, config: IAmqpConfig) {
  const conn = await getConnection(amqp, config);

  return await conn.close();
}

// TODO: Listen for process kill and disconnect? Maybe this happens automatically
export default async function createChannel(amqp: IAmqp, config: IAmqpConfig) {
  const conn = await getConnection(amqp, config);
  if (conn) {
    return await conn.createChannel();
  }
}
