import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

const receiveStream = new Subject<any>();

interface ILoopBackConfig {
  delay?: number;
}

function createReceiver() {
  return () => receiveStream.asObservable();
}

// Forward messages
const createSender = (config: ILoopBackConfig) => (
  sendStream: Observable<any>
) => {
  const delayAmount = config.delay || 0;
  const mappedStream = delayAmount
    ? sendStream.pipe(delay(delayAmount))
    : sendStream;

  mappedStream.subscribe(receiveStream);
  return sendStream;
};

export default (config: ILoopBackConfig = {}) => ({
  receiver: createReceiver(),
  sender: createSender(config)
});
