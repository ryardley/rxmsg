import { Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Connector, IMessage } from '../../types';

const receiveStream = new Subject<any>();

type LoopBackConfig = {
  delay?: number;
};

type ReceiverConfig = {
  route: string;
};

function createReceiver(route?: string) {
  const stream = receiveStream.asObservable();
  return () => (route ? stream.pipe(filter(m => m.to === route)) : stream);
}

// Forward messages
const createSender = <T extends IMessage>(config: LoopBackConfig) => (
  sendStream: Observable<T>
) => {
  const delayAmount = config.delay || 0;
  const mappedStream = delayAmount
    ? sendStream.pipe(delay(delayAmount))
    : sendStream;

  mappedStream.subscribe(receiveStream);
  return sendStream;
};

function receiver(options?: ReceiverConfig) {
  const route = options && options.route;
  return createReceiver(route);
}

export default function createConnector<T extends IMessage, P extends IMessage>(
  config: LoopBackConfig = {}
): Connector<T, P> {
  return {
    receiver,
    sender: () => createSender(config)
  };
}
