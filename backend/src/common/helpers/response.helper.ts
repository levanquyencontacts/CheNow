import { PaginationResult, ResponseDto } from '../dtos/response.dto';

export class ResponseHelper {
    static createPaginatedResponse<T, R>(
        paginationResult: PaginationResult<T>,
        transformFn: (item: T) => R,
        extraMetadata: Record<string, unknown> = {},
    ): ResponseDto<R[]> {
        return {
            data: paginationResult.items.map(transformFn),
            metadata: {
                pagination: {
                    page: paginationResult.page,
                    limit: paginationResult.limit,
                    total: paginationResult.total,
                    totalPages: paginationResult.totalPages,
                },
                ...extraMetadata,
            },
        };
    }
}
