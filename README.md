# blockbid-messaging

_Please note this is under development and is still in the design phase and is not yet ready for use_

This library makes it easy to send messages in a distributed network transparent
way via various brokers but initially via RabbitMQ.

At a later point we should have plugins to make it work with various messaging paradigms:

- Kafka
- socket.io (browser/server)
- Communicate between threads / workers

Some principles:

- Avoid API complexity.
- Keep middleware modular.
- Favour higher order functional configuration over classes.
- Basic framework should work in all V8 environments.
- Middleware might be environment specific. Eg. RabbitMiddlewarerequires node.

## Example Usage

```typescript
import {
  rabbitMiddleware,
  createConsumer,
  createProducer
} from 'blockbid-messaging';

const { sender, receiver } = rabbitMiddleware({
  uri: 'amqp://user:password@moose.rmq.cloudamqp.com/endpoint',
  // define structure here
  structures: {
    queues: [
      { name: 'fast', durable: true }, // These queues are used below
      { name: 'slow', durable: true },
      'logs' // Using strings will create a queue with the name logs and the default props
    ],
    exchanges: [
      {
        name: 'tasks',
        type: 'topic'
      }
    ],
    bindings: [
      {
        source: 'tasks',
        type: 'queue',
        destintation: 'fast', // this requires that the queue be defined above
        pattern: '*.fast'
      },
      {
        source: 'tasks',
        type: 'queue',
        destintation: 'slow', // this requires that the queue be defined above
        pattern: '*.slow'
      }
    ]
  }
});

// Example Middlware
// Middleware is simply a function that takes an Observable and returns an Observable
const logger = prefix => {
  return stream =>
    stream.pipe(tap(m => console.log(`${prefix}:${JSON.stringify(m)}`)));
};

const reportError = console.error.bind(console);

const fastConsumer = createConsumer(
  // List of middleware functions:
  // 1. First recieve message from rabbit define it to not require acks
  // 2. Then log the message with the tag `consumer-fast`
  receiver({ queue: 'fast', noAck: true }),
  logger('consumer-fast')
);

const slowConsumer = createConsumer(
  // List of middleware functions:
  // 1. First recieve message from rabbit
  // 2. Then log the message with the tag `consumer-slow`
  receiver({ queue: 'slow' }), // receiver(<IRabbitBinding | IRabbitQueue>);
  logger('consumer-slow')
);

const producer = createProducer(
  // List of middleware functions:
  // 1. First log the message with the tag `producer`
  // 2. Then send the message to rabbit
  logger('producer'),
  sender()
);

// Middleware can simply be wrapped around the producer like this too.
// This producer will now log twice!
const doubleLogger = logger('double-log')(producer);

// fastConsumer is simply an Rx.Observable https://rxjs-dev.firebaseapp.com/api/index/class/Observable
fastConsumer.subscribe(
  msg => console.log(`Just recieved ${msg.content} on FAST channel.`),
  reportError
);

// slowConsumer is simply an Rx.Observable https://rxjs-dev.firebaseapp.com/api/index/class/Observable
slowConsumer.subscribe(msg => {
  console.log(`Just recieved ${msg.content} on SLOW channel.`);
  msg.ack(); // acknowledge the message
}, reportError);

// Producer is simply an Rx.Observer https://rxjs-dev.firebaseapp.com/api/index/interface/Observer
producer.next({
  destination: 'fast',
  content: 'This will go straight to the fast queue and bypass all exchanges'
});

doubleLogger.next({
  destination: {
    exchange: 'tasks',
    routeKey: 'somefoo.fast'
  },
  content: 'send this to the fast queue via the tasks exchange'
});

producer.next({
  destination: {
    exchange: 'tasks',
    routeKey: 'somefoo.slow'
  },
  content: 'send this to the slow queue via the tasks exchange'
});
```

## Examples:

### Hello World

Solutions to rabbit tutorials

https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

```typescript
const { sender, receiver } = createRabbitMiddleware({
  uri: 'amqp://user:password@domain.com/user'
});

// P -> Q
const producer = createProducer(
  sender({
    queue: {
      name: 'hello',
      durable: false
    }
  })
);

producer.next({
  destination: 'hello',
  content: 'Hello World!'
});

// Q -> C
const consumer = createConsumer(
  receiver({
    queue: {
      name: 'hello',
      durable: false
    },
    noAck: true
  })
);

consumer.subscribe(msg => {
  console.log(' [x] Received %s', msg.content);
});
```

As they have a shared queue you can combine queue assertions in a master config

```typescript
const { sender, receiver } = createRabbitMiddleware({
  uri: 'amqp://user:password@domain.com/user',
  declarations: {
    queues: [
      {
        name: 'hello',
        durable: false
      }
    ]
  }
});

const producer = createProducer(
  sender({
    queue: 'hello'
  })
);

// ...

const consumer = createConsumer(
  receiver({
    queue: 'hello',
    noAck: true
  })
);

// ...
```

## References

- https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html
- https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
