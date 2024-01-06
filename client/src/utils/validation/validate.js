import Joi from "joi-browser";

const registerUserValidation = {
  first_name: Joi.string().max(50).required().label("First Name"),
  last_name: Joi.string().max(50).required().label("Last Name"),
  email: Joi.string().email({ tlds: false }).max(100).required().label("Email"),
  password: Joi.string().max(255).required().label("Password"),
  user_level_id: Joi.number().min(1).required(),
};

const loginUserValidation = {
  email: Joi.string().email({ tlds: false }).max(100).required().label("Email"),
  password: Joi.string().max(255).required().label("Password"),
};

const createProductValidation = {
  name: Joi.string().max(100).required().label("Name"),
  price: Joi.number().min(1).positive().required().label("Price"),
  qty: Joi.number().max(255).positive().required().label("Qty"),
  description: Joi.string().min(1).required().label("Description"),
};

export { registerUserValidation, loginUserValidation, createProductValidation };

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    return result.error.details;
  }
};

export default validate;
