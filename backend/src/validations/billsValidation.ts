import Joi from 'joi';

export const billsValidation = {
  createGroup: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500)
  }),

  updateGroup: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500),
    active: Joi.boolean()
  }),

  createBill: Joi.object({
    groupId: Joi.string().required(),
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().max(500),
    totalAmount: Joi.number().min(0.01).required(),
    participants: Joi.array().items(
      Joi.object({
        userId: Joi.string().required(),
        amount: Joi.number().min(0).required()
      })
    ).min(1).required(),
    category: Joi.string().required(),
    date: Joi.date().default(() => new Date())
  }),

  updateBill: Joi.object({
    title: Joi.string().min(2).max(200),
    description: Joi.string().max(500),
    totalAmount: Joi.number().min(0.01),
    participants: Joi.array().items(
      Joi.object({
        userId: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        paid: Joi.boolean()
      })
    ).min(1),
    category: Joi.string(),
    date: Joi.date(),
    status: Joi.string().valid('pending', 'settled', 'cancelled')
  })
};
