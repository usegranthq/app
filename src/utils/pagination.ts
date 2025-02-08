import { clamp, number } from './number';

type PaginationParams = {
  page: number;
  limit: number;
};

type PaginationParamsInput = {
  page: string | number;
  limit: string | number;
};

const DEFAULT_START_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_MIN_LIMIT = 1;
const DEFAULT_MAX_LIMIT = 100;

export function normalizePaginationParams(input: Partial<PaginationParamsInput>): PaginationParams {
  let page = number(input.page, DEFAULT_START_PAGE);
  let limit = number(input.limit, DEFAULT_LIMIT);

  page = clamp(page, DEFAULT_START_PAGE, Number.MAX_SAFE_INTEGER);
  limit = clamp(limit, DEFAULT_MIN_LIMIT, DEFAULT_MAX_LIMIT);

  return { page, limit };
}

export function toPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T> {
  return [data, { total, page, limit }];
}
