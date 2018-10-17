import { Observable, Observer } from 'rxjs';

import { Middleware } from '../types';
import { createConsumer } from './consumer';

it('should send messages from the middleware to the consumer', () => {
  const mockFn = jest.fn();
  const middleware: Middleware<any> = () => {
    return Observable.create((observer: Observer<any>) => {
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
