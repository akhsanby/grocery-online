import Joi from "joi";

const createCartValidation = Joi.object({
  user_id: Joi.number().positive().required(),
  product_id: Joi.number().positive().required(),
  quantity: Joi.number().min(1).positive().required().default(1),
});

const getCartValidation = Joi.number().positive().required();

const updateCartValidation = Joi.object({
  cart_id: Joi.number().positive().required(),
  quantity: Joi.number().min(1).positive().required().default(1),
});

export { createCartValidation, getCartValidation, updateCartValidation };
