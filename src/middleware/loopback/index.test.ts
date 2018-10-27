import loopbackMiddleware from '.';
import { createConsumer, createProducer } from '../../index';

describe('Using the loopback middleware synchronously', () => {
  const { receiver, sender } = loopbackMiddleware();

  it('should send and receive messages synchronously via a loopback middleware', () => {
    const log: any[] = [];
    const producer = createProducer(sender());
    const consumer = createConsumer(receiver());

    consumer.subscribe(msg => {
      log.push(msg);
    });

    producer.next({ body: 'One' });
    producer.next({ body: 'Two' });
    producer.next({ body: 'Three' });
    producer.next({ body: 'Four' });

    expect(log).toEqual([
      { body: 'One' },
      { body: 'Two' },
      { body: 'Three' },
      { body: 'Four' }
    ]);
  });

  it('should route over the loopback middleware', () => {
    const log: any[] = [];
    const log2: any[] = [];
    const producer = createProducer(sender());
    const consumer = createConsumer(receiver({ route: 'aaaa' }));

    consumer.subscribe(msg => {
      log.push(msg);
    });
    const consumer2 = createConsumer(receiver());

    consumer2.subscribe(msg => {
      log2.push(msg);
    });
    producer.next({ body: 'One', to: 'aaaa' });
    producer.next({ body: 'Two', to: 'aaaa' });
    producer.next({ body: 'Three' });
    producer.next({ body: 'Four' });

    expect(log).toEqual([
      { body: 'One', to: 'aaaa' },
      { body: 'Two', to: 'aaaa' }
    ]);

    expect(log2).toEqual([
      { body: 'One', to: 'aaaa' },
      { body: 'Two', to: 'aaaa' },
      { body: 'Three' },
      { body: 'Four' }
    ]);
  });
});
describe('Using the loopback middleware with persist', () => {
  it('should run the persist function for each message', done => {
    const mockPersist = jest.fn();
    const { receiver, sender } = loopbackMiddleware({
      persist: mockPersist
    });
    const producer = createProducer(sender());
    const consumer = createConsumer(receiver());

    let count = 0;

    consumer.subscribe(() => {
      count++;
      if (count === 4) {
        expect(mockPersist.mock.calls.length).toEqual(4);
        expect(mockPersist.mock.calls).toEqual([
          [{ body: 'One' }],
          [{ body: 'Two' }],
          [{ body: 'Three' }],
          [{ body: 'Four' }]
        ]);
        done();
      }
    });

    producer.next({ body: 'One' });
    producer.next({ body: 'Two' });
    producer.next({ body: 'Three' });
    producer.next({ body: 'Four' });
  });
});
describe('Using the loopback middleware asynchronously', () => {
  const { receiver, sender } = loopbackMiddleware({
    delay: 300
  });

  it('should send and receive messages asynchronously via a loopback middleware', done => {
    const log: any[] = [];
    const producer = createProducer(sender());
    const consumer = createConsumer(receiver());

    consumer.subscribe(msg => {
      log.push(msg);
      if (log.length === 4) {
        expect(log).toEqual([
          { body: 'One' },
          { body: 'Two' },
          { body: 'Three' },
          { body: 'Four' }
        ]);
        done();
      }
    });

    producer.next({ body: 'One' });
    producer.next({ body: 'Two' });
    producer.next({ body: 'Three' });
    producer.next({ body: 'Four' });

    expect(log).toEqual([]);
  });
});
