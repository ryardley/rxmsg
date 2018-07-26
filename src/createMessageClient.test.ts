import { from } from 'rxjs';
import createMessageClient from './createMessageClient';

describe('createMessageClient', () => {
  describe('middleware', () => {
    describe('when passed no middleware', () => {
      it('should complain', () => {
        const testMiddlewareGuard = () => createMessageClient();
        expect(testMiddlewareGuard).toThrow();
        expect(() => createMessageClient(() => from([]))).not.toThrow();
      });
    });

    describe('when passed middleware', () => {
      it('should be happy', () => {
        const testMiddlewareGuard = () => createMessageClient(() => from([]));
        expect(testMiddlewareGuard).not.toThrow();
      });
    });
  });
});
