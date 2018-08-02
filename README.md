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

### Hello World

Solutions to rabbit tutorials

https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

```typescript
const { sender, receiver } = createRabbitMiddleware(
  'amqp://user:password@domain.com/user'
);

function runProducer() {
  const producer = createProducer(
    sender({
      queue: {
        name: 'hello',
        durable: false
      }
    })
  );

  producer.next({
    route: 'hello',
    content: 'Hello World!'
  });
}

function runConsumer() {
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
}
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

function runProducer() {
  const producer = createProducer(sender());

  producer.next({
    route: 'hello',
    content: 'Hello World!'
  });
}

function runConsumer() {
  const consumer = createConsumer(
    receiver({
      queue: 'hello',
      noAck: true
    })
  );

  consumer.subscribe(msg => {
    console.log(' [x] Received %s', msg.content);
  });
}
```

### Work Queues

Solutions to rabbit tutorials

https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

```typescript
const { sender, receiver } = createRabbitMiddleware({
  uri: 'amqp://user:password@domain.com/user',
  declarations: {
    queues: {
      name: 'task_queue',
      durable: true
    }
  }
});

function runProducer() {
  const producer = createProducer(sender());

  producer.next({
    route: 'task_queue',
    persistent: true,
    content: 'Hello World!'
  });
}

function runConsumer() {
  const consumer = createConsumer(
    receiver({
      prefetch: 1
    })
  );

  consumer.subscribe(msg => {
    const secs = msg.content.split('.').length - 1;

    console.log(' [x] Received %s', msg.content);
    setTimeout(() => {
      console.log(' [x] Done');
      msg.ack();
    }, secs * 1000);
  });
}
```

### Publish / Subscribe

Solutions to rabbit tutorials

https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

```typescript
const { sender, receiver } = createRabbitMiddleware({
  uri: 'amqp://user:password@domain.com/user',
  declarations: {
    exchanges: [
      {
        name: 'logs',
        type: 'fanout',
        durable: false
      }
    ]
  }
});

function runProducer() {
  const producer = createProducer(sender());

  producer.next({
    route: { exchange: 'logs' },
    content: 'Hello World!'
  });
}

function runConsumer() {
  const consumer = createConsumer(
    receiver({
      noAck: true,
      bindings: [
        /*
        {
          destination: { // default destination is anonimous and exclusive
            name: '',
            exclusive: true
          },
          source: 'logs' // * REQUIRED
          type: 'queue', // default binding type
          pattern: '' // default pattern is not pattern
        }
        */
        'logs' // string is shorthand for above
      ]
    })
  );

  consumer.subscribe(msg => {
    console.log(' [x] Received %s', msg.content);
  });
}
```

### Routing

Solutions to rabbit tutorials

https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html

```typescript
const { sender, receiver } = createRabbitMiddleware({
  uri: 'amqp://user:password@domain.com/user',
  declarations: {
    exchanges: [
      {
        name: 'direct_logs',
        type: 'direct',
        durable: false
      }
    ]
  }
});

function runProducer(msg = 'Hello World', severity = 'info') {
  const producer = createProducer(sender());

  producer.next({
    route: { exchange: 'direct_logs', key: severity },
    content: msg
  });
}

function runConsumer(labels: array) {
  const consumer = createConsumer(
    receiver({
      noAck: true,
      bindings: labels.map(label => ({ source: 'direct_logs', pattern: label }))
    })
  );

  consumer.subscribe(msg => {
    console.log(" [x] %s: '%s'", msg.route.key, msg.content);
  });
}
```

### Topics

Solutions to rabbit tutorials

https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

```typescript
const { sender, receiver } = createRabbitMiddleware({
  uri: 'amqp://user:password@domain.com/user',
  declarations: {
    exchanges: [
      {
        name: 'topic_logs',
        type: 'topic',
        durable: false
      }
    ]
  }
});

function emitLog(msg = 'Hello World', key = 'anonymous.info') {
  const producer = createProducer(sender());

  producer.next({
    route: { exchange: 'topic_logs', key: key },
    content: msg
  });
}

function recieveLog(patterns: array) {
  const consumer = createConsumer(
    receiver({
      noAck: true,
      bindings: patterns.map(pattern => ({ source: 'topic_logs', pattern }))
    })
  );

  consumer.subscribe(msg => {
    console.log(" [x] %s: '%s'", msg.route.key, msg.content);
  });
}
/*

recieveLog(['#']); // To receive all the logs
recieveLog(['kern.*']); // To receive all logs from the facility "kern"
recieveLog(['*.critical']); // Or if you want to hear only about "critical" logs
recieveLog(['kern.*', '*.critical']); // You can create multiple bindings

emitLog('Critical log', 'kern.critical');

*/
```

## Full Usage

```typescript
import {
  rabbitMiddleware,
  createConsumer,
  createProducer
} from 'blockbid-messaging';

const { sender, receiver, close } = rabbitMiddleware({
  uri: 'amqp://user:password@moose.rmq.cloudamqp.com/endpoint',
  // define structure here
  structures: {
    queues: [
      { name: 'fast', durable: false }, // These queues are used below
      { name: 'slow', durable: false },
      'logs' // Using strings will create a queue with the name logs and the default props
    ],
    exchanges: [
      {
        name: 'tasks',
        type: 'topic',
        durable: false // default
      }
    ],
    // Bindings cannot be anonymous when setup within main config
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
  route: 'fast',
  content: 'This will go straight to the fast queue and bypass all exchanges'
});

doubleLogger.next({
  route: {
    exchange: 'tasks',
    key: 'somefoo.fast'
  },
  content: 'send this to the fast queue via the tasks exchange'
});

producer.next({
  route: {
    exchange: 'tasks',
    key: 'somefoo.slow'
  },
  content: 'send this to the slow queue via the tasks exchange'
});

// dont forget to close the connection and exit.
setTimeout(() => {
  close();
  process.exit();
}, 500);
```

## References

- https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html
- https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
