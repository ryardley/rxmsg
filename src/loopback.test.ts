import { createConsumer, createProducer } from './index';
import loopbackMiddleware from './middleware/loopback';

describe('Using the loopback middleware synchronously', () => {
  const {
    receiver: loopbackReceiver,
    sender: loopbackSender
  } = loopbackMiddleware();

  it('should send and receive messages synchronously via a loopback middleware', () => {
    const log = [];
    const producer = createProducer(loopbackSender);
    const consumer = createConsumer(loopbackReceiver);

    consumer.subscribe(msg => {
      log.push(msg);
    });

    producer.next({ payload: 'One' });
    producer.next({ payload: 'Two' });
    producer.next({ payload: 'Three' });
    producer.next({ payload: 'Four' });

    expect(log).toEqual([
      { payload: 'One' },
      { payload: 'Two' },
      { payload: 'Three' },
      { payload: 'Four' }
    ]);
  });
});

describe('Using the loopback middleware asynchronously', () => {
  const {
    receiver: loopbackReceiver,
    sender: loopbackSender
  } = loopbackMiddleware({ delay: 300 });

  it('should send and receive messages synchronously via a loopback middleware', done => {
    const log = [];
    const producer = createProducer(loopbackSender);
    const consumer = createConsumer(loopbackReceiver);

    consumer.subscribe(msg => {
      log.push(msg);
      if (log.length === 4) {
        expect(log).toEqual([
          { payload: 'One' },
          { payload: 'Two' },
          { payload: 'Three' },
          { payload: 'Four' }
        ]);
        done();
      }
    });

    producer.next({ payload: 'One' });
    producer.next({ payload: 'Two' });
    producer.next({ payload: 'Three' });
    producer.next({ payload: 'Four' });

    expect(log).toEqual([]);
  });
});
