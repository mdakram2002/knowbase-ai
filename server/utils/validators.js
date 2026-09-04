const { ValidationError } = require('./errors');

// Validation rules
const validators = {
  // Email validation
  email: (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
    return true;
  },

  // Password validation
  password: (password) => {
    if (!password || password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters', 'password');
    }
    return true;
  },

  // Name validation
  name: (name) => {
    if (!name || name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters', 'name');
    }
    if (name.length > 100) {
      throw new ValidationError('Name must be less than 100 characters', 'name');
    }
    return true;
  },

  // String validation with length
  string: (value, minLength = 1, maxLength = 1000, field = 'value') => {
    if (typeof value !== 'string') {
      throw new ValidationError(`${field} must be a string`, field);
    }
    if (value.trim().length < minLength) {
      throw new ValidationError(
        `${field} must be at least ${minLength} characters`,
        field
      );
    }
    if (value.length > maxLength) {
      throw new ValidationError(
        `${field} must not exceed ${maxLength} characters`,
        field
      );
    }
    return true;
  },

  // Number validation
  number: (value, min = 0, max = Infinity, field = 'value') => {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError(`${field} must be a number`, field);
    }
    if (value < min || value > max) {
      throw new ValidationError(
        `${field} must be between ${min} and ${max}`,
        field
      );
    }
    return true;
  },

  // ID validation (MongoDB ObjectId)
  mongoId: (id, field = 'id') => {
    if (!id || typeof id !== 'string' || !id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ValidationError(`Invalid ${field} format`, field);
    }
    return true;
  },

  // Array validation
  array: (value, minItems = 0, maxItems = 1000, field = 'array') => {
    if (!Array.isArray(value)) {
      throw new ValidationError(`${field} must be an array`, field);
    }
    if (value.length < minItems) {
      throw new ValidationError(
        `${field} must have at least ${minItems} items`,
        field
      );
    }
    if (value.length > maxItems) {
      throw new ValidationError(
        `${field} must not have more than ${maxItems} items`,
        field
      );
    }
    return true;
  },

  // URL validation
  url: (url, field = 'url') => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      throw new ValidationError(`Invalid ${field} format`, field);
    }
  },

  // Boolean validation
  boolean: (value, field = 'value') => {
    if (typeof value !== 'boolean') {
      throw new ValidationError(`${field} must be a boolean`, field);
    }
    return true;
  },

  // Pagination validation
  pagination: (page = 1, limit = 20) => {
    validators.number(page, 1, 1000000, 'page');
    validators.number(limit, 1, 100, 'limit');
    return { page: Math.max(1, page), limit: Math.min(100, limit) };
  },

  // Search query validation
  searchQuery: (query, minLength = 1, maxLength = 500) => {
    validators.string(query, minLength, maxLength, 'search query');
    return query.trim();
  },

  // Sanitize input (remove potentially dangerous characters)
  sanitize: (input) => {
    if (typeof input === 'string') {
      return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    return input;
  }
};

module.exports = validators;
