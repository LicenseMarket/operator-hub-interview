import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export const whereExample = [{ name: 'saeed' }, { id: 1 }];

export const orderByExample = [{ name: 'asc' }, { id: 'desc' }];

export class PaginationQueryDto {
  @ApiProperty({ example: 1, required: false })
  @Allow()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @Allow()
  limit?: number;

  @ApiHideProperty()
  @Allow()
  select?: Record<string, any>;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      example: orderByExample,
    },
    description: 'you can set any filed of model you trying to sort like {"id": "asc"}',
    required: false,
  })
  @Allow()
  orderBy?: Record<string, any>[];

  @ApiHideProperty()
  include?: Record<string, any>;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      example: whereExample,
    },
    description: `filter properties are: label, operator, lte, gte; property label and operator is array of ids`,
    required: false,
  })
  @Allow()
  filter?: Record<string, any>[];

  @ApiHideProperty()
  convertedFilter?: Record<string, any>;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      example: whereExample,
    },
    description: `search properties are: name, email, mobile, order_number,`,
    required: false,
  })
  @Allow()
  search?: Record<string, any>[];

  @ApiHideProperty()
  convertedSearch?: Record<string, any>;

  parseOrderBy(): void {
    if (this.orderBy && !Array.isArray(this.orderBy)) {
      this.orderBy = [this.orderBy];
    }
    if (this.orderBy && Array.isArray(this.orderBy)) {
      this.orderBy = this.orderBy.map((item: any) => JSON.parse(item));
    }
  }

  parseFilter(): void {
    if (this.filter && !Array.isArray(this.filter)) {
      this.filter = [this.filter];
    }
    if (this.filter && this.filter.length > 0 && Array.isArray(this.filter)) {
      this.filter = this.filter.map((item: any) => JSON.parse(item));
      this.convertedFilter = this.filter.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    }
  }

  parseSearch(): void {
    if (this.search && !Array.isArray(this.search)) {
      this.search = [this.search];
    }
    if (this.search && this.search && Array.isArray(this.search)) {
      this.search = this.search.map((item: any) => JSON.parse(item));
      this.convertedSearch = this.search.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    }
  }
}
