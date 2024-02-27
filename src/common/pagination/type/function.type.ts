import { PaginationQueryDto } from '../dto/query.dto';
import { PaginatedResult } from '../interface/result.interface';
import { PaginateOptions } from './option.type';

export type PaginateFunction = <T, K extends PaginationQueryDto>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;
