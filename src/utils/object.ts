export const formDataToObject = (formData: FormData) => {
  return Object.fromEntries(formData);
};

export const searchParamsToObject = (searchParams: URLSearchParams) => {
  return Object.fromEntries(searchParams.entries());
};

export const isObject = <T extends Record<string, unknown>>(value: unknown): value is T => {
  return typeof value === 'object' && value !== null;
};
