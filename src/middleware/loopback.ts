import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IMessage, MiddlewareCreator } from '../types';

const receiveStream = new Subject<IMessage>();

type ILoopBackConfig = {
  delay?: number;
} | void;

// Recieve messages
const createReceiver: MiddlewareCreator<ILoopBackConfig> = () => () => {
  return receiveStream.asObservable();
};

// Forward messages
const createSender: MiddlewareCreator<ILoopBackConfig> = config => (
  sendStream: Observable<IMessage>
) => {
  const mappedStream =
    config && typeof config.delay
      ? sendStream.pipe(delay(config.delay))
      : sendStream;

  mappedStream.subscribe(receiveStream);
  return sendStream;
};

export default (config?: ILoopBackConfig) => ({
  receiver: createReceiver(config),
  sender: createSender(config)
});
