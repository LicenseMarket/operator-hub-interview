import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateFunction } from '../type/function.type';
import { PaginateOptions } from '../type/option.type';
import { PaginationQueryDto } from '../dto/query.dto';
import { PrismaService } from 'src/prisma/service/prisma.service';
import * as util from 'util';

@Injectable()
export class PaginationService {
  paginate: PaginateFunction;

  constructor(private prisma: PrismaService) {
    this.paginate = this.createPaginator();
  }

  /**
   * Creates a paginator function with optional default options.
   * @param {PaginateOptions} defaultOptions - Default pagination options.
   * @returns {PaginateFunction} - Function for paginating data.
   */
  private createPaginator(defaultOptions?: PaginateOptions): PaginateFunction {
    return async (model, paginationQueryDto: PaginationQueryDto, options) => {
      try {
        const page = Number(options?.page || defaultOptions?.page || paginationQueryDto?.page) || 1;
        const limit =
          Number(options?.limit || paginationQueryDto?.limit || defaultOptions?.limit) || 10;
        if (limit > 1000) {
          throw new BadRequestException('limit reached');
        }
        const skip = page > 0 ? limit * (page - 1) : 0;
        let where;
        if (paginationQueryDto.convertedSearch && paginationQueryDto.convertedSearch.OR) {
          where = {
            OR: [
              ...(paginationQueryDto.convertedSearch.OR
                ? paginationQueryDto.convertedSearch.OR
                : []),
            ],
            ...paginationQueryDto.convertedFilter,
          };
        } else {
          where = {
            ...paginationQueryDto.convertedFilter,
          };
        }
        const data: any[] = await model.findMany({
          where,
          orderBy: paginationQueryDto.orderBy || { createdAt: 'desc' },
          take: limit + 1,
          skip,
          select: paginationQueryDto.select,
          include: paginationQueryDto.include,
        });
        let totalPage: number;
        if (data.length == limit + 1) totalPage = page + 1;
        else totalPage = page;

        return {
          list: data,
          meta: {
            total: skip + data.length + 1,
            totalPage,
            currentPage: page,
            limit,
          },
        };
      } catch (error) {
        throw error;
      }
    };
  }
}
