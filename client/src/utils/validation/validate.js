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
