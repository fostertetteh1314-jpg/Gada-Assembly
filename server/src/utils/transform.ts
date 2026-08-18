const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const transformKeys = (obj: Record<string, unknown>): Record<string, unknown> => {
  if (!obj || typeof obj !== 'object') return obj;
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key === 'id' ? '_id' : toCamelCase(key);
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[camelKey] = transformKeys(value as Record<string, unknown>);
      } else if (Array.isArray(value)) {
        result[camelKey] = value.map((item) => transformKeys(item as Record<string, unknown>));
      } else {
        result[camelKey] = value;
      }
    }
  }
  return result;
};

export const mapIdToUnderscoreId = (obj: Record<string, unknown> | null): Record<string, unknown> | null => {
  if (!obj) return null;
  return transformKeys(obj);
};

export const mapArrayIds = (arr: Record<string, unknown>[]): Record<string, unknown>[] => {
  return arr.map((item) => transformKeys(item));
};
