export const runIfFn = <T, A extends unknown[]>(value: T | ((...args: A) => T), ...args: A): T => {
  if (typeof value === 'function') {
    return (value as (...args: A) => T)(...args);
  }
  return value;
};
