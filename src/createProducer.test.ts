import createMessageClient from './createMessageClient';
import { Middleware } from './domain';

function getProducer(...middleware: Middleware[]) {
  return createMessageClient(...middleware).createProducer();
}

it('createProducer', () => {
  expect(true).toBe(true);
});
