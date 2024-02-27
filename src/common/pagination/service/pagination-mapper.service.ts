/**
 * Maps a value to a nested property within a given object using a specified path.
 * @param path - The dot-separated path to the target property.
 * @param obj - The object to map the value into.
 * @param value - The value to be mapped.
 * @returns The updated object with the value mapped to the specified path.
 */
export function PaginationMapper(path: string, obj: Record<string, any>, value: any) {
  // Initialize the current object to the root object.
  let currentObject = obj;

  // If a value is provided, proceed with mapping.
  if (value && value != '') {
    // Split the path into individual keys.
    const keys = path.split('.');

    // Traverse the object based on the path, creating nested objects as needed.
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      currentObject[key] = currentObject[key] || {};
      currentObject = currentObject[key];
    }

    // Map the value to the last key in the path.
    const lastKey = keys[keys.length - 1];
    currentObject[lastKey] = value;
  }

  // Return the updated object.
  if (Object.keys(obj).length > 0) {
    return obj;
  }
  return null;
}

/**
 * Maps date values for pagination query parameters.
 * If `lte` is provided, it returns the end of the day for that date.
 * If `gte` is provided, it returns the start of the day for that date.
 * @param {string} lte - The "less than or equal" date string.
 * @param {string} gte - The "greater than or equal" date string.
 * @returns {Date | string} - The mapped date or string.
 */
export function PaginationDateMapper(lte?: string, gte?: string): Date | string {
  if (lte) {
    const t = new Date(lte);
    t.setUTCHours(23, 59, 59, 999);
    return t;
  }
  if (gte) {
    const t = new Date(gte);
    t.setUTCHours(1, 0, 0, 0);
    return t;
  }
}
