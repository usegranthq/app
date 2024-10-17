type ActionResponse<T = null, Error = string> = Promise<[Error, null] | [null, T]>;
