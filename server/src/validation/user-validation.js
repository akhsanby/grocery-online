import Joi from "joi";

const registerUserValidation = Joi.object({
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().max(255).required(),
  user_level_id: Joi.number().min(1).required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().max(255).required(),
});

const getUserValidation = Joi.string().email().max(100).required();

const updateUserValidation = Joi.object({
  first_name: Joi.string().max(50).optional(),
  last_name: Joi.string().max(50).optional(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().max(255).optional(),
  address: Joi.string().max(255).optional(),
  phone_number: Joi.string().max(15).optional(),
});

export { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation };
