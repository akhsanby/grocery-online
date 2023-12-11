import Joi from "joi";

const createProductValidation = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().min(1).optional(),
  price: Joi.number().min(1).positive().required(),
  stock_quantity: Joi.number().positive().required(),
  thumbnail: Joi.string().min(5).max(255).optional(),
  category_id: Joi.number().min(1).required(),
});

const getProductValidation = Joi.number().positive().required();

const searchProductValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(12),
  name: Joi.string().optional(),
  category_id: Joi.number().optional(),
});

const updateProductValidation = Joi.object({
  product_id: Joi.number().positive().required(),
  name: Joi.string().max(100).required(),
  description: Joi.string().min(1).optional(),
  price: Joi.number().min(1).positive().required(),
  stock_quantity: Joi.number().positive().required(),
  thumbnail: Joi.string().min(5).max(255).optional(),
  category_id: Joi.number().min(1).required(),
});

export { createProductValidation, getProductValidation, searchProductValidation, updateProductValidation };
