type ActionResponse<T = null, E = string | null> = Promise<[E, E extends null ? T : T | null]>;

type SearchParams<T extends Record<string, string>> = { searchParams: Promise<T> };
type Params<T extends Record<string, unknown>> = { params: Promise<T> };

type Pagination = {
  page: number;
  limit: number;
  total: number;
};

type PaginatedResponse<T> = [T[], Pagination];
