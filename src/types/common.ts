export interface RequestLog {
  method: string;
  url: string;
  payload?: unknown;
  response?: unknown;
  status?: number;
  duration?: number;
  error?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
