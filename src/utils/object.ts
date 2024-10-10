export const formDataToObject = (formData: FormData) => {
  const obj: { [key: string]: FormDataEntryValue } = {};

  formData.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
};

export const isObject = <T extends Record<string, unknown>>(value: unknown): value is T => {
  return typeof value === 'object' && value !== null;
};
