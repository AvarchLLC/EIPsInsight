// Polyfill for structuredClone (Node.js < v17)
// This is needed for production environments running older Node.js versions

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = function structuredClone(value: any): any {
    // Simple deep clone implementation
    // For complex objects, this handles most cases
    if (value === null || typeof value !== 'object') {
      return value;
    }

    // Handle Date
    if (value instanceof Date) {
      return new Date(value.getTime());
    }

    // Handle Array
    if (Array.isArray(value)) {
      return value.map((item) => structuredClone(item));
    }

    // Handle Object
    if (value instanceof Object) {
      const clonedObj: any = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          clonedObj[key] = structuredClone(value[key]);
        }
      }
      return clonedObj;
    }

    // Fallback for other types
    return value;
  };
}

export {};
