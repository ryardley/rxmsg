import greeter from './index';

it('should greet', () => {
  expect(greeter('Ronald McDonald')).toBe('Hello, Ronald McDonald');
});
