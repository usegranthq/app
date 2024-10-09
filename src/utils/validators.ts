export const isNullOrUndefined = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

export const isNotNullOrUndefined = (value: any): value is NonNullable<any> => {
  return !isNullOrUndefined(value);
};
