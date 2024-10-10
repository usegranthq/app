export const isNullOrUndefined = (value: unknown): value is null | undefined => value === null || value === undefined;

export const isNotNullOrUndefined = <T>(value: T): value is NonNullable<T> => !isNullOrUndefined(value);
