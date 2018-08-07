import amqp from 'amqplib';
import { IRabbitConfig } from './domain';
export declare function getConnection(config: IRabbitConfig): Promise<amqp.Connection | undefined>;
export declare function closeConnection(config: IRabbitConfig): Promise<void>;
export default function createChannel(config: IRabbitConfig): Promise<amqp.Channel>;
