export const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null;
};

function replacer() {
  const seen = new WeakSet();
  return (_key: string, value: unknown) => {
    if (!isObject(value)) {
      return value;
    }

    if (seen.has(value)) {
      return '[Circular]';
    }

    seen.add(value);
    return value;
  };
}

export const sillyClone = (obj: unknown) => {
  return JSON.parse(JSON.stringify(obj, replacer()));
};
