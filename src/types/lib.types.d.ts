type ActionResponse<T = null, E = string | null> = Promise<[E, E extends null ? T : T | null]>;

type Params<T extends Record<string, unknown>> = { params: Promise<T> };
