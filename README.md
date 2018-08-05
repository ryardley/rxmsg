# RxJS wrapper for messaging systems

_Please note this is under development I don't expect the API to change much so it is tentatively ready for careful **NON** production use however there will be bugs and errors until the errors are explicitly handled in tests_

### tldr; Error handling has not been tested properly please assume this may not work and please help track down bugs and submit PRs!!

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

Fault resillience

- [ ] Solid Error handling
- [ ] If anything fails it will throw an Error and close the connection and retry X times
- [ ] Circuit breakers (Do we need to setup config/plugins for this?)

## Installation

You can install by referencing a version tag directly off the github repo.

```bash
yarn add blockbid/blockbid-message#2.x
```

## Basic Usecase

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

// Here is an RxJS Subject that sends the message
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

## Example Usage

For usage and examples please look at the basic (crappy) tests thrown together [here](src/__tests__)

## They are based on these tutorials:

- https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

These will become more extensive and include error handling later.

# PLEASE SUBMIT ISSUES AND PULL REQUESTS TO THIS REPO AS THEY ARISE!

- https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
