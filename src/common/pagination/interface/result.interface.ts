export interface PaginatedResult<T> {
  list: T[];
  meta: {
    total: number;
    totalPage: number;
    currentPage: number;
    limit: number;
  };
}
