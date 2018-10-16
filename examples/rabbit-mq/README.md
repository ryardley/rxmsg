# rxmsg Rabbit MQ example

## Install the example

Clone the repo

```bash
git clone git@github.com:ryardley/rxmsg.git
```

Move to the folder

```bash
cd ./rxmsg/examples/rabbit-mq
```

Install dependencies

```
yarn
```

## Run this example

Setup a RabbitMQ server somewhere and get a connection string.

I suggest trying a service such as https://www.cloudamqp.com/

Create an env file with your Rabbit connection string and save it to a file called `.env`:

```bash
# .env
RABBIT_URI=amqp://xxxxxx:xxxxxxx@mustang.rmq.cloudamqp.com/xxxxxxx
```

Run the consumer:

```
$ yarn consumer
INFO: Connected!
```

Then in a new terminal try running the producer

```bash
$ yarn producer
INFO: Connected!
INFO: Publishing message: {"content":"(455705) Hello World!"}
INFO: Publishing message: {"content":"(685c08) Hello World!"}
INFO: Publishing message: {"content":"(3cb1ef) Hello World!"}
 ...
```

You should see the consumer get the messages:

```bash
$ npm run producer
INFO: Connected!
Received: "(455705) Hello World!"
Received: "(685c08) Hello World!"
Received: "(3cb1ef) Hello World!"
 ...
```
