# blockbid-messaging

_Please note this is under development and is still in the design phase and is tentatively ready for careful non production use however there will be bugs_

### NOTE Error handling has not been tested properly please assume this may not work and please help track down bugs and submit PRs!!

This library makes it easy to send messages in a distributed network transparent
way via various brokers but initially via RabbitMQ.

At a later point we should have plugins to make it work with various messaging paradigms:

- Communicate locally between threads / workers (YTBI)
- socket.io (browser/server) (YTBI)
- Kafka (YTBI)

Some principles:

- Avoid API complexity.
- Declarative over imperative.
- Modular message decoration.
- Favour higher order functional configuration over classes.

Environments

- Basic framework should work in all V8 environments.
- Middleware might be environment specific. Eg. `blockbid-messages/amqp` requires node. `blockbid-messages/socketio-browser` may require browser objects. (YTBI)

Fault resillience

- If anything fails it will throw an Error and close the connection and retry X times (YTBI)

## Example Usage

For usage and examples please look at the crappy tests I have hacked together [here](src/__tests__)

## They are based on these tutorials:

- https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
- https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

These will become more extensive and include error handling later.

# PLEASE SUBMIT ISSUES AND PULL REQUESTS TO THIS REPO AS THEY ARISE!

- https://aws.amazon.com/blogs/compute/building-scalable-applications-and-microservices-adding-messaging-to-your-toolbox/
