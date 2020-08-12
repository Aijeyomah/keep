import Joi from '@hapi/joi';
import { textSchema } from './generic';

export const createTaskSchema = Joi.object({
  title: textSchema(Joi, 'title', 50, 1),
});

export const createTaskListSchema = Joi.object({
  task: textSchema(Joi, 'task', 150, 1),
  dueDate: Joi.string().required().label('task due date must be specified in the right format')
});
