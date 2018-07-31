// import amqp from 'amqplib';
// import { from, Observable } from 'rxjs';
// import { IMessage, Middleware } from '../domain';

// // const amqpUrl =
// //   'amqp://lzbwpbiv:g3FVGyfPasAwGEZ6z81PGf97xjRY-P8s@mustang.rmq.cloudamqp.com/lzbwpbiv';

// const nullObservable: Observable<IMessage> = from<IMessage>([]);

// interface IRabbitConfig {
//   amqpUrl: string;
//   noAck: boolean; // no idea if this is a good default
// }

// type RabbitMiddlewareCreator = (c: IRabbitConfig) => Middleware;

// // Recieve messages from Rabbit
// const createConsumer: RabbitMiddlewareCreator = config => () => {
//   return stream;
// };

// // Send messages from Rabbit
// const createProducer: RabbitMiddlewareCreator = ({ amqpUrl }) => (
//   stream: Observable<IMessage>
// ) => {
//   return nullObservable;
// };
