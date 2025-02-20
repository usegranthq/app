type ActionResponse<T = null | unknown, E = string> = Promise<
  // Error case - returns error message and null data
  | [E, null]
  // Success case - returns null error and data
  | [null, T]
  // Never case - returns never
  | never
>;

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
