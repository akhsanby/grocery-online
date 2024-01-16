import axios from "axios";
import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../app/database.js";
import validate from "../validation/validation.js";
import { getPaymentValidation, updatePaymentValidation } from "../validation/payment-validation.js";
import historyService from "./history-service.js";

const axiosMidtrans = axios.create({
  baseURL: "https://api.sandbox.midtrans.com/v2",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Basic ${process.env.MITRANS_HEADER_AUTH}`,
  },
});

async function create(request) {
  // generate transaction with mitrans API
  const result = await axiosMidtrans.post("/charge", request);
  const { status_code, status_message } = result.data;
  if (status_code >= 300 && status_code < 600) throw new ResponseError(status_code, status_message);

  // find user by email
  const user = await prismaClient.user.findFirst({
    where: {
      email: request.customer_details.email,
    },
  });
  if (!user) throw new ResponseError(404, "User is not found");

  // clear cart item after create payment
  await prismaClient.cart.deleteMany({
    where: {
      user_id: user.user_id,
    },
  });

  return result.data;
}

async function get(transaction_id) {
  transaction_id = validate(getPaymentValidation, transaction_id);

  const result = await axiosMidtrans.get(`/${transaction_id}/status`);
  return result.data;
}

export default {
  create,
  get,
};
