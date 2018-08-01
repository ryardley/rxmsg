import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Middleware } from './domain';
import { createProducer } from './producer';

it('should send messages from the producer to the middleware', () => {
  const mockFn = jest.fn();
  const nullStream = from([]);

  const middleware: Middleware = o => {
    o.pipe(tap(mockFn)).subscribe();
    return nullStream;
  };

  const producer = createProducer(middleware);
  producer.next({ payload: 1 });
  expect(mockFn.mock.calls.length).toBe(1);

  producer.next({ payload: 2 });
  producer.next({ payload: 3 });

  expect(mockFn.mock.calls.length).toBe(3);
});

it('should store messages until it is subscribed', done => {
  const middleware: Middleware = o => {
    const mockFn = jest.fn();
    setTimeout(() => {
      o.subscribe(mockFn);
      expect(mockFn.mock.calls).toEqual([[{ payload: 1 }], [{ payload: 2 }]]);
      done();
    }, 100);
    return from([]); // nullStream;
  };
  const producer = createProducer(middleware);
  producer.next({ payload: 1 });
  producer.next({ payload: 2 });
});
