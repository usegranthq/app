type ActionResponse<T = null, E = string | null> = Promise<[E, E extends null ? T : T | null]>;

type SearchParams<T extends Record<string, string>> = Promise<T>;
type Params<T extends Record<string, unknown>> = Promise<T>;

type DefaultPropsType = Record<string, unknown>;

type PageProps<T extends DefaultPropsType, P extends DefaultPropsType, S extends DefaultPropsType> = {
  params: Params<P>;
  searchParams: SearchParams<S>;
} & T;

type PaginationProps = Partial<{ page: string; limit: string }>;

type Pagination = {
  page: number;
  limit: number;
  total: number;
};

type PaginatedResponse<T> = [T[], Pagination];
