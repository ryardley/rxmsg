export function createValidator<T>(schemaLike: { check: (a: any) => void }) {
  return (value: any): T => {
    schemaLike.check(value);

    return value as T;
  };
}
