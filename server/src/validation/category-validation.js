import Joi from "joi";

const getCategoryValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  category_id: Joi.number().positive().optional(),
});

export { getCategoryValidation };
