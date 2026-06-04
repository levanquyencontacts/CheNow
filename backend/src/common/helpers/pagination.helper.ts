import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationParamsDto } from '../dtos/request.dto';
import { PaginationResult } from '../dtos/response.dto';

export type PaginateOptions = {
    /** When true, do not apply orderBy — caller must set ORDER BY on the query first. */
    skipBuiltinOrderBy?: boolean;
};

export class PaginationHelper {
    static async paginate<T extends ObjectLiteral>(
        queryBuilder: SelectQueryBuilder<T>,
        paginationParams: PaginationParamsDto,
        allowedSortFields: string[] = [],
        defaultSortField: string = 'id',
        searchFields: string[] = [],
        entityAlias?: string,
        options?: PaginateOptions,
    ): Promise<PaginationResult<T>> {
        const {
            page = 1,
            limit = 10,
            sort = defaultSortField,
            order = 'ASC',
            searchValue,
        } = paginationParams;

        const offset = (page - 1) * limit;
        const alias = entityAlias || queryBuilder.alias;

        if (searchValue && searchFields.length > 0) {
            const searchConditions = searchFields.map(
                (field) => `${alias}.${field} ILIKE :searchTerm`,
            );

            queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, {
                searchTerm: `%${searchValue}%`,
            });
        }

        const validSortField = allowedSortFields.includes(sort)
            ? sort
            : defaultSortField;

        const total = await queryBuilder.getCount();

        let itemsQuery = queryBuilder.skip(offset).take(limit);

        if (!options?.skipBuiltinOrderBy) {
            itemsQuery = itemsQuery.orderBy(`${alias}.${validSortField}`, order);
        }

        const items = await itemsQuery.getMany();

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
