import { identity, Observable, Subject } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { Connector, IMessage } from '../../types';

const receiveStream = new Subject<any>();
type PersistFn = (payload: any) => Promise<boolean>;
type LoopBackConfig = {
  delay?: number;
  persist?: PersistFn;
};

type ReceiverConfig = {
  route: string;
};

export default function createConnector<T extends IMessage, P extends IMessage>(
  config: LoopBackConfig = {}
): Connector<T, P> {
  function createReceiver(route?: string) {
    return () =>
      receiveStream
        .asObservable()
        .pipe(route ? filter((m: P) => m.to === route) : identity);
  }

  // Forward messages
  const createSender = (loopBackConfig: LoopBackConfig) => (
    sendStream: Observable<T>
  ) => {
    const delayAmount = loopBackConfig.delay || 0;
    // Fork the stream to receive
    const { persist } = loopBackConfig;
    sendStream
      .pipe(
        persist ? tap(persist) : identity,
        delayAmount ? delay(delayAmount) : identity
      )
      .subscribe(receiveStream);
    return sendStream;
  };
  return {
    receiver: (options?: ReceiverConfig) =>
      createReceiver(options && options.route),
    sender: () => createSender(config)
  };
}
