import Joi from 'joi';

// Common email schema
export const emailSchema = Joi.string().email({ tlds: { allow: false } }).required().messages({
  'string.empty': 'Email is required',
  'string.email': 'Please enter a valid email',
});

// Common password schema
export const passwordSchema = Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
  .required()
  .messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one letter and one number',
  });

// Common confirm password schema
Joi.any().equal(Joi.ref('password')).required().messages({
  'any.only': 'Passwords do not match',
  'string.empty': 'Password confirmation is required',
});

// Registration schema
export const registrationSchema = Joi.object({
  email: emailSchema,
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one letter and one number',
    }),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Password confirmation is required',
  }),
});

// Login schema
export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Change password schema
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'string.empty': 'Old password is required',
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one letter and one number',
    }),
  confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Password confirmation is required',
  }),
});