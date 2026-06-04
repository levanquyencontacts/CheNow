export class PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ResponseDto<T> {
  data: T;
  metadata?: {
    pagination: PaginationMetaDto;
    [key: string]: unknown;
  };
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExchangeRateApiResponse {
  result: string;
  conversion_rates: Record<string, number>;
  error?: string;
}
