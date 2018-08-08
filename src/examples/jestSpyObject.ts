interface IJ {
  jestSpyCalls?: jest.Mock;
}

export function jestSpyObject<T>(object: T): T & IJ {
  const spyCalls = jest.fn();
  const out: T & IJ = Object.entries(object).reduce((o, [key, original]) => {
    if (typeof original !== 'function') {
      return;
    }

    return {
      ...o,
      [key]: jest.fn((...args) => {
        spyCalls(
          key,
          ...args.map(arg => (typeof arg !== 'function' ? arg : '_FUNCTION_'))
        );
        return original(...args);
      })
    };
  }, {}) as T;
  out.jestSpyCalls = spyCalls;
  return out;
}
