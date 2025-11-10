// Validation utilities for forms

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateURL = (url) => {
  if (!url) return null; // Optional field
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL (e.g., https://example.com)';
  }
};

export const validateDate = (dateString) => {
  if (!dateString) return null; // Optional field
  // Format: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return 'Please enter date in YYYY-MM-DD format';
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  return null;
};

export const validateRating = (rating) => {
  if (!rating) return null; // Optional field
  const num = parseFloat(rating);
  if (isNaN(num) || num < 0 || num > 5) {
    return 'Rating must be a number between 0 and 5';
  }
  return null;
};

export const validatePositiveNumber = (value, fieldName) => {
  if (!value) return null; // Optional field
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

export const validateInteger = (value, fieldName) => {
  if (!value) return null; // Optional field
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0) {
    return `${fieldName} must be a non-negative whole number`;
  }
  return null;
};

