import Joi from 'joi';

export const calendarValidation = {
  createEvent: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000),
    startTime: Joi.date().required(),
    endTime: Joi.date().greater(Joi.ref('startTime')).required(),
    allDay: Joi.boolean().default(false),
    location: Joi.string().max(200),
    attendees: Joi.array().items(Joi.string()).default([]),
    category: Joi.string().valid('work', 'personal', 'health', 'social').default('personal'),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    reminders: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('email', 'push', 'sms').required(),
        minutesBefore: Joi.number().min(0).required()
      })
    ).default([]),
    recurring: Joi.object({
      frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
      interval: Joi.number().min(1).default(1),
      endDate: Joi.date()
    })
  }),

  updateEvent: Joi.object({
    title: Joi.string().min(1).max(200),
    description: Joi.string().max(1000),
    startTime: Joi.date(),
    endTime: Joi.date(),
    allDay: Joi.boolean(),
    location: Joi.string().max(200),
    attendees: Joi.array().items(Joi.string()),
    category: Joi.string().valid('work', 'personal', 'health', 'social'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    reminders: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('email', 'push', 'sms').required(),
        minutesBefore: Joi.number().min(0).required()
      })
    ),
    recurring: Joi.object({
      frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
      interval: Joi.number().min(1).default(1),
      endDate: Joi.date()
    }),
    status: Joi.string().valid('confirmed', 'tentative', 'cancelled')
  }),

  createTask: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    dueDate: Joi.date(),
    category: Joi.string().required(),
    tags: Joi.array().items(Joi.string().max(30)).default([]),
    estimatedDuration: Joi.number().min(1),
    subtasks: Joi.array().items(
      Joi.object({
        title: Joi.string().min(1).max(100).required(),
        completed: Joi.boolean().default(false)
      })
    ).default([])
  }),

  updateTask: Joi.object({
    title: Joi.string().min(1).max(200),
    description: Joi.string().max(1000),
    completed: Joi.boolean(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date(),
    category: Joi.string(),
    tags: Joi.array().items(Joi.string().max(30)),
    estimatedDuration: Joi.number().min(1),
    actualDuration: Joi.number().min(1),
    subtasks: Joi.array().items(
      Joi.object({
        title: Joi.string().min(1).max(100).required(),
        completed: Joi.boolean().default(false)
      })
    )
  })
};
