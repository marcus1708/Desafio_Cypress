const typeMatches = (value, type) => {
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'array') return Array.isArray(value);
  if (type === 'string') return typeof value === 'string';
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'boolean') return typeof value === 'boolean';
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'null') return value === null;
  return true;
};

export const assertSchema = (value, schema, path = 'body') => {
  if (schema.type) {
    expect(typeMatches(value, schema.type), `${path} should be ${schema.type}`).to.eq(true);
  }

  if (schema.required) {
    schema.required.forEach((key) => {
      expect(value, `${path} should contain ${key}`).to.have.property(key);
    });
  }

  if (schema.properties && value && typeof value === 'object') {
    Object.entries(schema.properties).forEach(([key, childSchema]) => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        assertSchema(value[key], childSchema, `${path}.${key}`);
      }
    });
  }

  if (schema.items && Array.isArray(value)) {
    value.forEach((item, index) => assertSchema(item, schema.items, `${path}[${index}]`));
  }

  if (schema.minLength !== undefined && typeof value === 'string') {
    expect(value.length, `${path} length`).to.be.at.least(schema.minLength);
  }

  if (schema.enum) {
    expect(schema.enum, `${path} enum`).to.include(value);
  }
};
