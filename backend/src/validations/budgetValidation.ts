import Joi from 'joi';

export const budgetValidation = {
  createCategory: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    budgetAmount: Joi.number().min(0).required(),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
    icon: Joi.string().required()
  }),

  updateCategory: Joi.object({
    name: Joi.string().min(2).max(50),
    budgetAmount: Joi.number().min(0),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
    icon: Joi.string(),
    active: Joi.boolean()
  }),

  createExpense: Joi.object({
    categoryId: Joi.string().required(),
    amount: Joi.number().min(0.01).required(),
    description: Joi.string().min(1).max(200).required(),
    date: Joi.date().default(() => new Date()),
    tags: Joi.array().items(Joi.string().max(30)).default([]),
    location: Joi.object({
      name: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }),
    recurring: Joi.object({
      frequency: Joi.string().valid('weekly', 'monthly', 'yearly').required(),
      endDate: Joi.date()
    })
  }),

  updateExpense: Joi.object({
    categoryId: Joi.string(),
    amount: Joi.number().min(0.01),
    description: Joi.string().min(1).max(200),
    date: Joi.date(),
    tags: Joi.array().items(Joi.string().max(30)),
    location: Joi.object({
      name: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }),
    recurring: Joi.object({
      frequency: Joi.string().valid('weekly', 'monthly', 'yearly').required(),
      endDate: Joi.date()
    })
  })
};
