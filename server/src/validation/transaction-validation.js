import Joi from "joi";

const createTransactionValidation = Joi.object({
  user_id: Joi.number().required(),
  transaction_type: Joi.object({
    payment_type: Joi.string().valid("echannel", "bank_transfer", "qris", "cstore").required(),
    echannel: Joi.alternatives().conditional("payment_type", {
      is: "echannel",
      then: Joi.object({
        bill_info1: Joi.string().required().default("Payment For:"),
        bill_info2: Joi.string().required().default("Buy product"),
      }),
    }),
    bank_transfer: Joi.alternatives().conditional("payment_type", {
      is: "bank_transfer",
      then: Joi.object({
        bank: Joi.string().valid("bca", "permata", "bni", "bri", "cimb").required(),
      }),
    }),
    qris: Joi.alternatives().conditional("payment_type", {
      is: "qris",
      then: Joi.object({
        acquirer: Joi.string().valid("gopay").required(),
      }),
    }),
    cstore: Joi.alternatives().conditional("payment_type", {
      is: "cstore",
      then: Joi.object({
        store: Joi.string().valid("Indomaret", "alfamart").required(),
      }),
    }),
  }),
  total_price: Joi.number().required(),
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

const checkTransactionValidation = Joi.string().max(100).required();

export { createTransactionValidation, checkTransactionValidation };
