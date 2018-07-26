import { from } from 'rxjs';
import createMessageClient from './createMessageClient';

it('should complain if there is no middleware', () => {
  expect(() => createMessageClient()).toThrow();
  expect(() => createMessageClient(() => from([]))).not.toThrow();
});
