import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IMessage } from '../types';

const receiveStream = new Subject<IMessage>();

type ILoopBackConfig = {
  delay?: number;
} | void;

function createReceiver() {
  return () => receiveStream.asObservable();
}

// Forward messages
const createSender = (config: ILoopBackConfig) => (
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
  receiver: createReceiver(),
  sender: createSender(config)
});
