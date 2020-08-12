import Joi from '@hapi/joi';
import { textSchema, emailSchema } from './generic';

export const signUpSchema = Joi.object({
  firstName: textSchema(Joi, 'first_name', 32, 2),
  lastName: textSchema(Joi, 'last_name', 32, 2),
  email: emailSchema(Joi),
  password: textSchema(Joi, 'password', 100, 5),
});

export const loginSchema = Joi.object({
  email: emailSchema(Joi),
  password: textSchema(Joi, 'password', 100, 5),
});
