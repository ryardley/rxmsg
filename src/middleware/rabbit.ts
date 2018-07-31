import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IConfigObject, IMessage, MiddlewareCreator } from '../domain';

const receiveStream = new Subject<IMessage>();

interface ILoopBackConfig extends IConfigObject {
  delay?: number;
}

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

export default (c?: ILoopBackConfig) => ({
  receiver: createReceiver(c),
  sender: createSender(c)
});
