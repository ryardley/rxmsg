import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { createProducer } from './producer';
import { Middleware } from './types';

it('should send messages from the producer to the middleware', () => {
  const mockFn = jest.fn();
  const nullStream = from([]);

  const middleware: Middleware<any> = o => {
    o.pipe(tap(mockFn)).subscribe();
    return nullStream;
  };

  const producer = createProducer(middleware);
  producer.next({ content: 1 });
  expect(mockFn.mock.calls.length).toBe(1);

  producer.next({ content: 2 });
  producer.next({ content: 3 });

  expect(mockFn.mock.calls.length).toBe(3);
});

it('should store messages until it is subscribed', done => {
  const middleware: Middleware<any> = o => {
    const mockFn = jest.fn();
    setTimeout(() => {
      o.subscribe(mockFn);
      expect(mockFn.mock.calls).toEqual([[{ content: 1 }], [{ content: 2 }]]);
      done();
    }, 100);
    return from([]); // nullStream;
  };
  const producer = createProducer(middleware);
  producer.next({ content: 1 });
  producer.next({ content: 2 });
});
