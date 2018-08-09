# RxJS wrapper for messaging systems

_Please note this is under development I don't expect the API to change much so it is tentatively ready for careful **NON PRODUCTION USE** however there will be bugs and errors until the errors are explicitly handled in tests_

### Please help track down bugs and submit PRs!!

This library makes it easy to send messages in a distributed network transparent
way via various brokers but initially via RabbitMQ.

#### Roadmap

At a later point we should have plugins to make it work with various messaging paradigms:

- [x] AMQP
- [ ] Kafka
- [ ] Communicate locally between threads / workers
- [ ] socket.io (browser/server)

#### Principles:

- Declarative over imperative.
- Functions over classes.
- Simplicity over complexity.
- Immutable over mutable.
- Flexible and composable over fixed heirarchy.
- Pure over impure.
- Minmalistic sensible defaults over boilerplate.
- Idiomatic API's over reinventing the wheel.

#### Environments

- Basic framework should work in all V8 environments. eg.
- Middleware might be environment specific. Eg. `blockbid-messages/amqp` requires node. `blockbid-messages/socketio-browser` may require browser objects. (YTBI)

#### TODO

- [x] Mock out tests properly
- [x] Export proper typescript types
- [x] Revisit `blockbid-tools` and ensure it supports versioning
- [ ] Implement connection resillience
- [ ] Fix concurrent connection issues
- [ ] Guard for configuration shape
- [ ] Write docs on AMQP middleware
- [ ] Send errors upstream

## Installation

You can install by referencing a version tag directly off the github repo.

```bash
yarn add blockbid/blockbid-message#2.x
```

## Framework Usage

```typescript
import { createConsumer, createProducer } from 'blockbid-message';
import { filter } from 'rxjs/opeerators';

// createProducer accepts a list of middleware
// the message passes top down
// It returns an RxJS Observer that sends messages
const producer = createProducer(
  transformMessageSomehow,
  broadCastsMessagesSomewhere
);

// createConsumer also accepts a list of middleware
// the message also passes top down
// It returns an RxJS Observable that will receive the message
const consumer = createConsumer(
  receivesMessagesFromSomewhere,
  logOrTransformMessage,
  doSomeMoreTransformation
);

// Use RxJS's Observable#next() method to send a message
producer.next({
  content: 'Hello World!',
  route: 'hello'
});

// Note that because consumer is simply an RxJS observable
// you can apply filtering and throttling or do whatever you want to it
const sub = consumer
  .pipe(filter(msg => msg.content.toLowerCase().includes('world')))
  .subscribe(msg => {
    console.log(`Received: ${msg.content}`);
  });
```

### Typescript types

#### Messages

Generic message objects look like this:

```typescript
// Generic message
export interface IMessage {
  content: any;
  route?: any;
}
```

You might use a message by sending it to the `next()` method of a producer.

```typescript
producer.next({
  content: 'Hi there!',
  route: 'some-queue'
});
```

#### Middleware

Middleware are effectively functions designed to decorate RxJS streams and looks like this:

```typescript
// Generic Middleware decorates a stream
export type Middleware<T extends IMessage> = (
  a: Observable<T>
) => Observable<T>;
```

You might use a middleware by passing it as one of the arguments to the `createProducer()` or `createConsumer()` functions

```typescript
import {tap} from 'rxjs/operators';

function logger(stream: Observable<IMessage>) {
  return stream
    .pipe(tap(
      (msg:IMessage) => console.log(`Stream logged: ${msg.content}`
    ));
}

// Pass the middleware in order to the consumer or producer
const consumer = createConsumer(someReceiver, logger);
```

## AMQP Middleware

AMQP Middleware is designed to work in Node environments only due to limitations with the amqplib package it is based on.

### Basic Usecase with amqp middleware

```javascript
import { createConsumer, createProducer } from 'blockbid-message';

import { createAmqpConnector } from 'blockbid-message/amqp';

const { sender, receiver } = createAmqpConnector({
  declarations: {
    // This declares the queue you want to use
    queues: [
      {
        durable: false,
        name: 'hello'
      }
    ]
  },
  uri: 'amqp://user:password@somerabbitserver.io/user'
});

// Here is an RxJS Observer that sends the message
const producer = createProducer(sender());

producer.next({
  content: 'Hello World!',
  route: 'hello'
});

// Here is an RxJS Observable that will receive the message
const consumer = createConsumer(
  receiver({
    noAck: true,
    queue: 'hello'
  })
);

const sub = consumer.subscribe(msg => {
  console.log(`Received: ${msg.content}`);
});

sub.unsubscribe();
```

### Example Usage AMQP Middleware

For usage and examples please look at the basic tests thrown together [here](test)

1.  [Hello World](test/01-hello-world.test.ts)
1.  [Work Queues](test/02-work-queues.test.ts)
1.  [PubSub](test/03-publish-subscribe.test.ts)
1.  [Routing](test/04-routing.test.ts)
1.  [Topics](test/05-topics.test.ts)

## RxJS References

### Docs

- [RxJS API Reference](https://rxjs-dev.firebaseapp.com/)
- [Learn RxJS](https://www.learnrxjs.io/)

### Videos

- [Introduction to RxJS (old version) (Video)](https://www.youtube.com/watch?v=T9wOu11uU6U&t=446s)
- [Changes in RxJS 6 (Video)](https://www.youtube.com/watch?v=X9fdpGthrXA)

### NOTE: Using version 6

`blockbid-message` uses **RxJS v6.0** so you need to pipe all your operators:

```typescript
import { filter } from 'rxjs/operators';

// ...

consumer.pipe(filter(forUserEvents(userId))).subscribe(
  msg => {
    dealWithMessage(msg.content);
  },
  () => {}
);
```

## Other References

- https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html
- https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
