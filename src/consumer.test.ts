import { Observable } from 'rxjs';

import { createConsumer } from './consumer';
import { Middleware } from './types';

it('should send messages from the middleware to the consumer', () => {
  const mockFn = jest.fn();
  const middleware: Middleware = () => {
    return Observable.create(observer => {
      observer.next({ content: 1 });
      observer.next({ content: 2 });
      observer.next({ content: 3 });
      observer.next({ content: 4 });
    });
  };
  const consumer = createConsumer(middleware);
  consumer.subscribe(mockFn);
  expect(mockFn.mock.calls.length).toBe(4);
});
