import { Observable, Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

const receiveStream = new Subject<any>();

interface ILoopBackConfig {
  delay?: number;
}

function createReceiver(route?: string) {
  const stream = receiveStream.asObservable();
  return () => (route ? stream.pipe(filter(m => m.route === route)) : stream);
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

function receiver(options?: { route: string }) {
  const route = options && options.route;
  return createReceiver(route);
}

export default (config: ILoopBackConfig = {}) => ({
  receiver,
  sender: () => createSender(config)
});
