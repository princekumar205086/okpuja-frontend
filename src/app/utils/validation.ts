export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export class Validator {
  static validate(data: any, rules: ValidationRules): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(rules).forEach(field => {
      const value = data[field];
      const rule = rules[field];
      const error = this.validateField(value, rule, field);
      
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }

  static validateField(value: any, rule: ValidationRule, fieldName: string): string | null {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${this.formatFieldName(fieldName)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.formatFieldName(fieldName)} must be at least ${rule.minLength} characters`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.formatFieldName(fieldName)} must be less than ${rule.maxLength} characters`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${this.formatFieldName(fieldName)} format is invalid`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  static formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-\(\)]{10,}$/,
  pincode: /^\d{6}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  name: /^[a-zA-Z\s]{2,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/,
};

// Common validation rules
export const CommonRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: ValidationPatterns.name,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: ValidationPatterns.name,
  },
  email: {
    required: true,
    pattern: ValidationPatterns.email,
    maxLength: 254,
  },
  phone: {
    pattern: ValidationPatterns.phone,
  },
  pincode: {
    required: true,
    pattern: ValidationPatterns.pincode,
  },
  pan: {
    required: true,
    pattern: ValidationPatterns.pan,
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  state: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  country: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
};
