import Joi from "joi";

const createHistoryValidation = Joi.object({
  user_id: Joi.number().required(),
  transaction_id: Joi.string().max(100).required(),
  transaction_detail: Joi.string().required(),
  product_details: Joi.array().items(
    Joi.object({
      id: Joi.number().max(50).required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().min(1).positive().required(),
      thumbnail: Joi.string().required().allow(""),
    })
  ),
});

const getHistoryValidation = Joi.number().required();
const getTransactionIdValidation = Joi.string().required();

const updateHistoryValidation = Joi.object({
  transaction_id: Joi.string().max(100).required(),
  transaction_detail: Joi.string().required(),
});

export { createHistoryValidation, getHistoryValidation, getTransactionIdValidation, updateHistoryValidation };
