interface IJ {
  jestSpyCalls: jest.Mock;
}

export function jestSpyObject<T>(object: T): T & IJ {
  const jestSpyCalls = jest.fn();
  const out = Object.entries(object).reduce((o, [key, original]) => {
    if (typeof original !== 'function') {
      return;
    }

    return {
      ...o,
      [key]: jest.fn((...args) => {
        jestSpyCalls(
          key,
          ...args.map(arg => (typeof arg !== 'function' ? arg : '_FUNCTION_'))
        );
        return original(...args);
      })
    };
  }, {});

  return { ...out, jestSpyCalls } as T & IJ;
}
