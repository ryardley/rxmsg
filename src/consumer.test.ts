import { Observable } from 'rxjs';

import { createConsumer } from './consumer';
import { Middleware } from './domain';

it('should send messages from the middleware to the consumer', () => {
  const mockFn = jest.fn();
  const middleware: Middleware = () => {
    return Observable.create(observer => {
      observer.next({ payload: 1 });
      observer.next({ payload: 2 });
      observer.next({ payload: 3 });
      observer.next({ payload: 4 });
    });
  };
  const consumer = createConsumer(middleware);
  consumer.subscribe(mockFn);
  expect(mockFn.mock.calls.length).toBe(3);
});
