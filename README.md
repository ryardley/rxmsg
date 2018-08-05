# RxJS wrapper for messaging systems

_Please note this is under development I don't expect the API to change much so it is tentatively ready for careful **NON PRODUCTION USE** however there will be bugs and errors until the errors are explicitly handled in tests_

### Please help track down bugs and submit PRs!!

This library makes it easy to send messages in a distributed network transparent
way via various brokers but initially via RabbitMQ.

At a later point we should have plugins to make it work with various messaging paradigms:

- [x] AMQP
- [ ] Kafka
- [ ] Communicate locally between threads / workers
- [ ] socket.io (browser/server)

Some principles:

- Declarative over imperative.
- Avoid complexity where possible.
- Functional modular middleware.
- Avoid using classes.

Environments

- Basic framework should work in all V8 environments. eg.
- Middleware might be environment specific. Eg. `blockbid-messages/amqp` requires node. `blockbid-messages/socketio-browser` may require browser objects. (YTBI)

Fault resillience (YTBI)

- [ ] Solid Error handling
- [ ] If anything fails it will throw an Error and close the connection and retry X times
- [ ] Circuit breakers (Do we need to setup config/plugins for this?)

## Installation

You can install by referencing a version tag directly off the github repo.

```bash
yarn add blockbid/blockbid-message#2.x
```

### Typescript types

[Not yet tested getting types exported yet. There might be config that need updating. Please add that info here.]

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
// It returns an RxJS Observer that sends messages
// Here is an RxJS Observable that will receive the message
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
  .pipe(filter(msg => msg.userId === 'af435'))
  .subscribe(msg => {
    console.log(`Received: ${msg.content}`);
  });
```

## Middleware Structure

Basically the structure of middleware is that you accept a stream and return a stream.

```typescript
(stream: Observable<IMessage>) => Observable<IMessage>
```

Where IMessage looks like this (this may change):

```typescript
export interface IMessage {
  content: any;
  route?: any;
  ack?: () => void;
}
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
```

### Example Usage AMQP Middleware

For usage and examples please look at the basic (crappy) tests thrown together [here](src/__tests__)

1.  [Hello World](src/__tests__/01-hello-world.test.ts)
1.  [Work Queues](src/__tests__/02-work-queues.test.ts)
1.  [PubSub](src/__tests__/03-publish-subscribe.test.ts)
1.  [Routing](src/__tests__/04-routing.test.ts)
1.  [Topics](src/__tests__/05-topics.test.ts)

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
