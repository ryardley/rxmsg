import amqplib from 'amqplib';
import bindCloserCreatorToAmqpLib from './createCloser';
import bindReceiverCreatorToAmqpLib from './createReceiver';
import bindSenderCreatorToAmqpLib from './createSender';
import { IAmqp, IAmqpConfig } from './types';

export const createInjectableAmqpConnector = (amqp: IAmqp) => (
  config?: IAmqpConfig
) => {
  const createReceiver = bindReceiverCreatorToAmqpLib(amqp);
  const createSender = bindSenderCreatorToAmqpLib(amqp);
  const createCloser = bindCloserCreatorToAmqpLib(amqp);

  const close = createCloser(config);
  const receiver = createReceiver(config);
  const sender = createSender(config);

  return {
    close,
    receiver,
    sender
  };
};

export default createInjectableAmqpConnector(amqplib);
