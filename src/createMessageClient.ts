import { Middleware } from './domain';
export default function createMessageClient(...middleware: Middleware[]) {
  if (!middleware || middleware.length === 0) {
    throw new Error('No middleware provided to message client.');
  }
}
