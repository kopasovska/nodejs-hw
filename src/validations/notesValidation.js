import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).trim().required().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title can not be empty',
      'string.min': 'Title must have at least {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').trim().messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'string.base': 'Tag must be a string',
        'any.only':
          'Tag must be one of the allowed values: Work, Personal, Meeting, Shopping, Ideas, Travel, Finance, Health, Important, Todo.',
      }),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).trim().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title can not be empty',
      'string.min': 'Title must have at least {#limit} characters',
    }),
    content: Joi.string().allow('').trim().messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'string.base': 'Tag must be a string',
        'any.only':
          'Tag must be one of the allowed values: Work, Personal, Meeting, Shopping, Ideas, Travel, Finance, Health, Important, Todo.',
      }),
  }).min(1),
};

export const getAllNotesSchema = {
  [Segments.PARAMS]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow('').trim(),
  }),
};
