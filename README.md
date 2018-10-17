![RxJS Message Diagram](docs/images/diagram.png?123)

# RxMsg

### A powerfully simple universal messaging wrapper

This library makes it easy to send messages in a distributed network transparent way via various brokers using RxJS streams.

RxJS Message uses a versatile middleware pattern to create messaging endpoints that are extremely flexible. 

## Sending a message

```typescript
const { createProducer } = require('rxmsg');
const { createAmqpConnector } = require('rxmsg/amqp');
const { amqpConfig } = require('./amqpConfig');

const middleware = createAmqpConnector(amqpConfig).sender();
const producer = createProducer(middleware);

// RxJS observer
producer.next({content: 'Hello World!', route: 'hello');
```

## Receiving a message

```typescript
const { createConsumer } = require('rxmsg');
const { createAmqpConnector } = require('rxmsg/amqp');
const { amqpConfig } = require('./amqpConfig');

const middleware = createAmqpConnector(amqpConfig).receiver({ noAck: true, queue: 'hello' });
const consumer = createConsumer(middleware);

// RxJS observable
consumer.subscribe(msg => {
  console.log(`Received: "${msg.content}"`);
});
```

## Configure your broker 

```typescript
module.exports.amqpConfig = {
  declarations: {
    // List the queues, exchanges etc. you want to use here.
    queues: [ 
      {
        durable: false,
        name: 'hello'
      }
    ]
  },
  uri: 'amqp://user:password@somerabbitserver.io/user'
};

```

## Using Middleware

The endpoint creators each accept a list of middleware as arguments. When the producer sends a message it passes top down through the list of middleware.

### Producer middleware

Messages come into the system top to bottom. In this case from a `producer.next(msg)` call.

```typescript
const producer = createProducer(
  transformMessageSomehow,     // Step 1 - Do some transformation
  broadCastsMessagesSomewhere  // Step 2 - The last middleware must do the broadcasting
);
```

### Consumer middleware

Again, messages come into the system top to bottom. Here this would be from an external broker via the top middleware.

```typescript
const consumer = createConsumer(
  receivesMessagesFromSomewhere, // Step 1 - The first middleware must emit the message.
  logOrTransformMessage,         // Step 2 - Perhaps send the message to a logger.
  doSomeMoreTransformation       // Step 3 - Run another transform on the message before subscription.
);
```

### Creating your own Middleware

Middlewares are simple as they are only functions designed to decorate RxJS streams. Here is how you would describe them in TypeScript:

```typescript
type Middleware = (stream: Observable) => Observable;
```

Here is an example:

```typescript
function logger(stream) {
  return stream.pipe(
    tap(
      (msg) => console.log(`Stream logged: ${msg.content}`
    )
  );
}
```

You might use a middleware by passing it as one of the arguments to the `createProducer()` or `createConsumer()` functions.  

```typescript
const consumer = createConsumer(
  amqpReceiver,
  logger
);
```

### Manipulating messages

Note that because consumer is simply an RxJS observable you can apply filtering and throttling or do whatever you want to it

```typescript
const sub = consumer
  .pipe(filter(msg => msg.content.toLowerCase().includes('world')))
  .subscribe(msg => {
    console.log(`Received: ${msg.content}`);
  });
```

## Installation

You can install over npm.

```bash
yarn add rxmsg
```

```bash
npm install rxmsg --save
```

### Getting Started Examples

You can checkout the getting started example here:

1. [RabbitMQ](examples/rabbit-mq)
1. Kafka (coming soon)
1. Node Processes (coming soon)
1. Web Workers (coming soon)
1. Socket.io (coming soon)

### RabbitMQ Examples as tests

For usage and examples please look at the basic tests thrown together [here](test)

1.  [Hello World](test/01-hello-world.test.ts)
1.  [Work Queues](test/02-work-queues.test.ts)
1.  [PubSub](test/03-publish-subscribe.test.ts)
1.  [Routing](test/04-routing.test.ts)
1.  [Topics](test/05-topics.test.ts)


### Usage with Typescript

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


## Project Principles:

- Declarative over imperative.
- Functions over classes.
- Simplicity over complexity.
- Immutable over mutable.
- Flexible and composable over fixed heirarchy.
- Pure over impure.
- Minmalistic sensible defaults over boilerplate.
- Idiomatic API's over reinventing the wheel.

### Environments

- Basic framework should work in all V8 environments. eg.
- Middleware is environment specific. Eg. `rxmsg/amqp` requires node. `rxmsg/socketio-browser` (coming soon) requires a browser environment eg. `window`, `document` etc.


## Broker Support
Currently we support the following brokers:

- [x] AMQP / RabbitMQ
- [ ] Kafka
- [ ] Node Processes
- [ ] Web Workers
- [ ] Socket.io

Is there a message broker you would like to see on this list? Want to get a specific integration sooner? 

[Create an issue](/ryardley/rxmsg/issues) or [talk to me](https://twitter.com/rudiyardley) about sponsoring this project.

## RxJS References

### Docs

- [RxJS API Reference](https://rxjs-dev.firebaseapp.com/)
- [Learn RxJS](https://www.learnrxjs.io/)

### Videos

- [Introduction to RxJS (old version) (Video)](https://www.youtube.com/watch?v=T9wOu11uU6U&t=446s)
- [Changes in RxJS 6 (Video)](https://www.youtube.com/watch?v=X9fdpGthrXA)

### NOTE: Using version 6

`rxmsg` uses **RxJS v6.0** so you need to pipe all your operators:

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
