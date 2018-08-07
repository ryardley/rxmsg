import amqp from 'amqplib';
import { IAmqpConfig } from './domain';
export declare function getConnection(config: IAmqpConfig): Promise<amqp.Connection | undefined>;
export declare function closeConnection(config: IAmqpConfig): Promise<void>;
export default function createChannel(config: IAmqpConfig): Promise<amqp.Channel>;
