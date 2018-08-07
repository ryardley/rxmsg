import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { combineMiddleware } from './middleware';
import { Middleware } from './types';

describe('combineMiddleware', () => {
  it('should send messages in order', () => {
    const log = [];

    const middleware1: Middleware = o =>
      o.pipe(tap(msg => log.push(`middleware1: ${msg.content}`)));
    const middleware2: Middleware = o =>
      o.pipe(tap(msg => log.push(`middleware2: ${msg.content}`)));
    const middleware3: Middleware = o =>
      o.pipe(tap(msg => log.push(`middleware3: ${msg.content}`)));

    const middlewareFunc = combineMiddleware(
      middleware1,
      middleware2,
      middleware3
    );

    const s = middlewareFunc(
      from([{ content: 1 }, { content: 2 }, { content: 3 }])
    ).subscribe(msg => {
      log.push(`subscribe: ${msg.content}`);
    });

    expect(log).toEqual([
      // First message
      'middleware1: 1',
      'middleware2: 1',
      'middleware3: 1',
      'subscribe: 1',
      // Second message
      'middleware1: 2',
      'middleware2: 2',
      'middleware3: 2',
      'subscribe: 2',
      // Third message
      'middleware1: 3',
      'middleware2: 3',
      'middleware3: 3',
      'subscribe: 3'
    ]);

    s.unsubscribe();
  });

  describe('no middleware function', () => {
    it('should send the observer through', () => {
      const log = [];
      combineMiddleware()(from([{ content: 1 }, { content: 2 }])).subscribe(
        msg => log.push(`subscribe: ${msg.content}`)
      );
      expect(log).toEqual(['subscribe: 1', 'subscribe: 2']);
    });
  });
});
