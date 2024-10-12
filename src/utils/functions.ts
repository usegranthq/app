export const runIfFn = <T>(value: T | ((...args: any[]) => T), ...args: any[]) => {
  if (typeof value === 'function') {
    return (value as (...args: any[]) => T)(...args);
  }
  return value;
};
