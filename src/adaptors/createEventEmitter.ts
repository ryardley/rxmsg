import { Observable, Observer, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { createConsumer } from '../endpoints/consumer';
import { createProducer } from '../endpoints/producer';
import { Middleware } from '../types';
type CallBackFn = (payload: any) => void;
class RxMsgEventEmitter<T, P> {
  private producer: Observer<{ to: string; body: T }>;
  private consumer: Observable<{ to: string; body: P }>;
  private subscriptions: { [k: string]: Map<CallBackFn, Subscription> } = {};

  constructor(
    sender: Middleware<{ to: string; body: T }> | undefined,
    receiver: Middleware<{ to: string; body: P }> | undefined
  ) {
    if (sender) {
      this.producer = createProducer<{ to: string; body: T }>(sender);
    }
    if (receiver) {
      this.consumer = createConsumer<{ to: string; body: P }>(receiver);
    }
  }

  public on = (eventName: string, callback: CallBackFn) => {
    const subscription = this.consumer
      .pipe(filter(m => m.to === eventName))
      .subscribe(msg => {
        callback(msg.body);
      });
    this.subscriptions[eventName] = this.subscriptions[eventName] || new Map();
    this.subscriptions[eventName].set(callback, subscription);
  };

  public off = (eventName: string, callback: CallBackFn) => {
    const subscription = this.subscriptions[eventName].get(callback);
    if (subscription) {
      subscription.unsubscribe();
    }
  };
  public emit = (to: string, body: T) => {
    this.producer.next({ body, to });
  };
}

export default function createEventEmitter<T, P>(o: {
  sender?: Middleware<{ to: string; body: T }>;
  receiver?: Middleware<{ to: string; body: P }>;
}): RxMsgEventEmitter<T, P> {
  return new RxMsgEventEmitter(o.sender, o.receiver);
}
