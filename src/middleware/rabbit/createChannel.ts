import amqp from 'amqplib';
import { IRabbitConfig } from './domain';

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

// TODO: fix concurrent connections issue

// we only need a single TCP connection per node and can use channels
let singletonConn: amqp.Connection = null;
export async function getConnection(config: IRabbitConfig) {
  if (!singletonConn) {
    console.log('Creating connection...'); // tslint:disable-line
    try {
      singletonConn = await createConnection(config);
    } catch (err) {
      throwConnectionError(err);
    }
  }
  return singletonConn;
}

export async function closeConnection(config: IRabbitConfig) {
  const conn = await getConnection(config);
  return await conn.close();
}

// TODO: Listen for process kill and disconnect? Maybe this happens automatically
export default async function createChannel(config: IRabbitConfig) {
  const conn = await getConnection(config);
  return await conn.createChannel();
}
