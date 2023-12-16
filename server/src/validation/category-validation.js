import Joi from "joi";

const getCategoryValidation = Joi.number().positive().required();

export { getCategoryValidation };
