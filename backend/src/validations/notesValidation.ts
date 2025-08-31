import Joi from 'joi';

export const notesValidation = {
  createNote: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: Joi.string().required(),
    tags: Joi.array().items(Joi.string().max(30)).default([]),
    category: Joi.string().valid('note', 'journal', 'meeting', 'idea').default('note'),
    favorite: Joi.boolean().default(false)
  }),

  updateNote: Joi.object({
    title: Joi.string().min(1).max(200),
    content: Joi.string(),
    tags: Joi.array().items(Joi.string().max(30)),
    category: Joi.string().valid('note', 'journal', 'meeting', 'idea'),
    favorite: Joi.boolean()
  }),

  shareNote: Joi.object({
    userIds: Joi.array().items(Joi.string()).min(1).required(),
    permissions: Joi.string().valid('read', 'write').default('read')
  }),

  createJournalEntry: Joi.object({
    title: Joi.string().min(1).max(200).default(() => `Journal Entry - ${new Date().toLocaleDateString()}`),
    content: Joi.string().required(),
    mood: Joi.number().integer().min(1).max(5),
    tags: Joi.array().items(Joi.string().max(30)).default(['journal'])
  })
};
