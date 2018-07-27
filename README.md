# blockbid-messaging

This library makes it easy to send messages in a distributed network transparent
way via various brokers but initially via RabbitMQ.

At a later point we should have plugins to make it work:

- via Kafka
- in the browser using socker.io
- on the server via socket.io
- locally through node spawned processes

Some principles:

- Modular middleware system inspired by Redux and Express
- Favour higher order functional configuration over classes inheritence and DI
- Basic framework should work in all V8 environments.
- Favour Simplicity over complexity

```typescript
import { Observable, Subject } from 'rxjs';

export interface IDestination {
  via?: string;
  to: string;
}

export interface IMessage {
  payload: {};
  meta?: {};
  dest?: IDestination;
  [key: string]: any;
}

export type Producer = Subject<IMessage>;
export type Consumer = Observable<IMessage>;

export type Middleware = (a: Observable<IMessage>) => Observable<IMessage>;
```

```typescript
import {
  // Plugins
  createRabbitMiddleware,
  createConsumer,
  createProducer,

  // Core
  createMessageClient
} from 'blockbid-messaging';

import { map } from 'rxjs/operators';

const rabbitMiddleware: Middleware = createRabbitMiddleware({
  uri:
    'amqp://xvjvsrrc:VbuL1atClKt7zVNQha0bnnScbNvGiqgb@moose.rmq.cloudamqp.com/xvjvsrrc'
  // more config ...
});

const transformMessageSomehow: Middleware = o =>
  o.pipe(
    map(msg => ({
      ...msg,
      foo: 'foo'
    }))
  );

const loggerMiddleware: Middleware = o => o.pipe(tap(m => console.log(m)));

// Create consumer and producer
// Consumer is just an Observable
const consumer: Consumer = createConsumer(
  rabbitMiddleware,
  loggerMiddleware,
  transformMessageSomehow
);

// Producer is just a Subject
const producer: Producer = createProducer(
  transformMessageSomehow,
  loggerMiddleware,
  rabbitMiddleware
);

// Get messages as an RxJS stream
// const messageStream: Observable<Message> = consumer.messageStream();
const subscription = consumer.subscribe(
  ({ payload }) => console.log(`Just recieved ${payload}`),
  console.error
);

// Messages have a payload and can contain a number of dynamic metadata keys
const dest: IDestination = {
  via: 'my-exchange',
  to: 'my-destination-consumer'
};

producer.next({ dest, payload: 'foo', meta: { ding: 'pop' } });
producer.next({ dest, payload: 'bar' });
producer.next({ dest, payload: { baz: 'baz' } }); // can be object that will be

setTimeout(() => {
  subscription.unsubscribe();
}, 3000);
```

## References

https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
