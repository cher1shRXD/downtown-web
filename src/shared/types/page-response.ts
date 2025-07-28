export interface PageResponse<T> {
  data: T[];
  hasNextPage: boolean;
  nextCursor?: string;
}