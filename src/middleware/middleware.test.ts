import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Middleware } from '../types';
import { combineMiddleware } from './middleware';

describe('combineMiddleware', () => {
  it('should send messages in order', () => {
    const log: any[] = [];

    const middleware1: Middleware<any> = o =>
      o.pipe(tap(msg => log.push(`middleware1: ${msg.body}`)));
    const middleware2: Middleware<any> = o =>
      o.pipe(tap(msg => log.push(`middleware2: ${msg.body}`)));
    const middleware3: Middleware<any> = o =>
      o.pipe(tap(msg => log.push(`middleware3: ${msg.body}`)));

    const middlewareFunc = combineMiddleware(
      middleware1,
      middleware2,
      middleware3
    );

    const s = middlewareFunc(
      from([{ body: 1 }, { body: 2 }, { body: 3 }])
    ).subscribe(msg => {
      log.push(`subscribe: ${msg.body}`);
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
      const log: any[] = [];
      combineMiddleware()(
        from([{ body: 1, to: {} }, { body: 2, to: {} }])
      ).subscribe(msg => log.push(`subscribe: ${msg.body}`));
      expect(log).toEqual(['subscribe: 1', 'subscribe: 2']);
    });
  });
});
