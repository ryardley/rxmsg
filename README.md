# blockbid-messaging

_Please note this is under development and is still in the design phase and is not yet ready for use_

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
- Middleware might be environment specific
- Favour Simplicity over complexity

## Example Usage

```typescript
import {
  rabbitMiddleware,
  createConsumer,
  createProducer
} from 'blockbid-messaging';

const rabbit = rabbitMiddleware({
  uri: 'amqp://user:password@moose.rmq.cloudamqp.com/endpoint',
  // define structure here
  structures: {
    queues: {
      fast: { durable: true },
      slow: { durable: true }
    },
    exchanges: {
      tasks: {
        type: 'fanout'
      }
    },
    bindings: [
      {
        source: 'tasks',
        destintation: 'fast',
        pattern: '*.fast'
      },
      {
        source: 'tasks',
        destintation: 'slow',
        pattern: '*.slow'
      }
    ]
  }
});

// Log whatever message this receives
// Middlware is simply a function that takes an Observable and returns an Observable
const logger: Middleware = stream => stream.pipe(tap(m => console.log(m)));

// fastConsumer is simply an Rx.Observable
createConsumer(
  // Middleware list
  rabbit.receiver({ queue: 'fast', noAck: true }), //  first recieve message from rabbit
  logger // then log the message
).subscribe(
  ({ content }) => console.log(`Just recieved ${content} on FAST channel.`), // report message
  console.error.bind(console) // send errors to the console
);

// slowConsumer is simply an Rx.Observable
createConsumer(
  rabbit.receiver({ queue: 'slow' }), //  first recieve message from rabbit
  logger // then log it
).subscribe(
  ({ content }) => console.log(`Just recieved ${content} on SLOW channel.`), // report message
  console.error.bind(console) // send errors to the console
);

// Producer is simply an Rx.Observer
const producer = createProducer(
  logger, // first log the incoming message
  // could add other middleware to modify the message or produce side effects
  // or even send the message to multiple exchanges etc.
  rabbit.sender() // then send it to rabbit
);

// Middleware can simply be wrapped around the producer like this too.
// This producer will now log twice!
const fastProducer = logger(producer).pipe(
  map(msg => ({
    destination: {
      exchange: 'tasks',
      routeKey: 'tasks.fast'
    },
    ...msg
  }))
);

const slowProducer = producer.pipe(
  map(msg => ({
    destination: {
      exchange: 'tasks',
      routeKey: 'tasks.slow'
    },
    ...msg
  }))
);

fastProducer.next({
  content: 'send this to the fast queue'
});

slowProducer.next({
  content: 'send this to the slow queue'
});
```

## References

https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html
https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
