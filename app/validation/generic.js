export const textSchema = (joiObject, field, max, min) => joiObject
  .string()
  .trim()
  .min(min)
  .max(max)
  .required()
  .messages({
    'string.base': `${field} must be a valid string`,
    'string.empty': `${field} cannot be an empty string`,
    'string.min': `${field} must be at least ${min} characters long`,
    'string.max': `${field} must be at most ${max} characters long`,
    'any.required': `${field} is required`,
  });

export const emailSchema = (joiObject) => joiObject.string().trim().email().required()
  .messages({
    'string.base': 'Email address must be a valid string',
    'string.empty': 'Email address cannot be an empty string',
    'any.required': 'Email address is required',
    'string.email': 'The Email address is invalid',
  });
