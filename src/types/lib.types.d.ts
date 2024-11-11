type ActionResponse<T = null, E = string | null> = Promise<[E, E extends null ? T : T | null]>;
