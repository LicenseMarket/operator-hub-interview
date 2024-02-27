import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePaginationQueryPipe implements PipeTransform<any> {
  /**
   * Transform the incoming query parameters to handle pagination-related operations.
   * @param value - The incoming query parameters.
   * @param metadata - Metadata about the request.
   * @returns The transformed query parameters.
   */
  transform(value: any, metadata: ArgumentMetadata): any {
    // If no query parameters are provided, return as is.
    if (!value || value == '' || value == '') {
      return value;
    }

    // Parse 'orderBy' parameter if present.
    if (value.orderBy) {
      this.parseArray(value, 'orderBy');
    }

    // Parse 'filter' parameter if present, and convert it to a record.
    if (value.filter) {
      this.parseArray(value, 'filter');
      this.convertToRecord(value, 'filter', 'convertedFilter');
    }

    // Parse 'search' parameter if present, and convert it to a record.
    if (value.search) {
      this.parseArray(value, 'search');
      this.convertToRecord(value, 'search', 'convertedSearch');
    }

    // Return the transformed query parameters.
    return value;
  }

  /**
   * Parse an array in the query parameters.
   * @param obj - The object containing query parameters.
   * @param key - The key of the array to parse.
   */
  private parseArray(obj: any, key: string): void {
    // If the array is a JSON string, parse it.
    if (this.isArrayOfString(obj[key])) {
      obj[key] = this.parseJsonArray(obj[key]);
      return;
    }

    // If the array is not an array, convert it to a single-element array.
    if (!Array.isArray(obj[key])) {
      obj[key] = [obj[key]];
    }

    // Parse each element of the array as JSON.
    obj[key] = obj[key].map((item: any) => this.parseJson(item, key));
  }

  /**
   * Convert an array to a record object.
   * @param obj - The object containing query parameters.
   * @param sourceKey - The key of the source array.
   * @param targetKey - The key for the converted record.
   */
  private convertToRecord(obj: any, sourceKey: string, targetKey: string): void {
    // If the source array is not empty, reduce it to a record object.
    if (obj[sourceKey].length > 0) {
      obj[targetKey] = this.reduceArrayToRecord(obj[sourceKey]);
    }

    for (const key of Object.keys(obj[targetKey])) {
      const value = obj[targetKey][key];

      if (typeof value === 'string' && (value === '' || value.trim() === '')) {
        delete obj[targetKey][key];
      }
    }
  }

  /**
   * Check if a value is a string representing a JSON array.
   * @param value - The value to check.
   * @returns True if the value is a JSON array string, false otherwise.
   */
  private isArrayOfString(value: any): boolean {
    return typeof value === 'string' && value.startsWith('[');
  }

  /**
   * Parse a JSON array string into an array.
   * @param value - The JSON array string.
   * @returns The parsed array.
   */
  private parseJsonArray(value: string): any[] {
    return JSON.parse(value);
  }

  /**
   * Parse a JSON string into an object.
   * @param item - The JSON string.
   * @param key - The key associated with the JSON string.
   * @returns The parsed object.
   * @throws BadRequestException if the JSON parsing fails.
   */
  private parseJson(item: any, key: string): any {
    try {
      return JSON.parse(item);
    } catch (error) {
      throw new BadRequestException(`invalid format ${key}`);
    }
  }

  /**
   * Reduce an array of objects to a single record object.
   * @param array - The array to reduce.
   * @returns The reduced record object.
   */
  private reduceArrayToRecord(array: any[]): any {
    return array.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});
  }
}
