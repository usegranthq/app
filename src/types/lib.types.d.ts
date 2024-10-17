type ActionResponse<T = null, E = string> = Promise<[E, null] | [null, T]>;
