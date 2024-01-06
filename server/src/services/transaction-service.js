import axios from "axios";
import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../app/database.js";
import validate from "../validation/validation.js";
import { createTransactionValidation, checkTransactionValidation } from "../validation/transaction-validation.js";
import { v4 as uuid } from "uuid";

const axiosMidtrans = axios.create({
  baseURL: "https://api.sandbox.midtrans.com",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Basic ${process.env.MITRANS_HEADER_AUTH}`,
  },
});

async function create(userId, transactionType, totalPrice, productDetails) {
  validate(createTransactionValidation, {
    user_id: userId,
    transaction_type: transactionType,
    total_price: totalPrice,
    product_details: productDetails,
  });

  // find user by user id
  const user = await prismaClient.user.findFirst({
    where: {
      user_id: userId,
    },
  });
  if (!user) throw new ResponseError(404, "User is not found");

  const transactionData = {
    ...transactionType,
    transaction_details: {
      order_id: uuid(),
      gross_amount: totalPrice,
    },
    item_details: productDetails,
    customer_details: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone_number,
      billing_address: {
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone_number,
        address: user.address,
      },
      shipping_address: {
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone_number,
        address: user.address,
      },
    },
    custom_expiry: {
      expiry_duration: 60,
      unit: "minute",
    },
  };
  // generate transaction with mitrans API
  const result = await axiosMidtrans.post("/v2/charge", transactionData);

  const { status_code, status_message } = result.data;
  if (status_code >= 500 && status_code < 600) throw new ResponseError(status_code, status_message);

  return result.data;
}

async function check(transactionId) {
  validate(checkTransactionValidation, transactionId);

  // generate transaction with mitrans API
  const result = await axiosMidtrans.get(`/v2/${transactionId}/status`);
  const { status_code, status_message } = result.data;
  if (status_code >= 500 && status_code < 600) throw new ResponseError(status_code, status_message);

  return result.data;
}

export default {
  create,
  check,
};
