import Joi from 'joi';

export const userValidation = {
  updateProfile: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters'
      }),
    
    email: Joi.string()
      .email()
      .messages({
        'string.email': 'Please provide a valid email address'
      })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      })
  }),

  updatePreferences: Joi.object({
    theme: Joi.string()
      .valid('light', 'dark', 'auto')
      .messages({
        'any.only': 'Theme must be light, dark, or auto'
      }),
    
    notifications: Joi.object({
      email: Joi.boolean(),
      push: Joi.boolean(),
      avatar: Joi.boolean(),
      health: Joi.boolean(),
      budget: Joi.boolean(),
      bills: Joi.boolean()
    }),
    
    privacy: Joi.object({
      profileVisibility: Joi.string()
        .valid('public', 'private')
        .messages({
          'any.only': 'Profile visibility must be public or private'
        }),
      dataSharing: Joi.boolean()
    })
  })
};
