import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { createHistoryValidation, getHistoryValidation, getTransactionIdValidation, updateHistoryValidation } from "../validation/history-validation.js";
import validate from "../validation/validation.js";

async function create(request) {
  request = validate(createHistoryValidation, request);

  const user = await prismaClient.user.findFirst({
    where: {
      user_id: request.user_id,
    },
  });

  if (!user) throw new ResponseError(404, "User not found");

  const connectHistoryAndProduct = request.product_details.map((product) => {
    return {
      assignedBy: user.email,
      assignedAt: new Date(),
      quantity: product.quantity,
      product: {
        connect: {
          product_id: product.id,
        },
      },
    };
  });

  const history = await prismaClient.history.create({
    data: {
      user_id: user.user_id,
      transaction_id: request.transaction_id,
      full_name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      address: user.address,
      transaction_detail: request.transaction_detail,
      product: {
        create: connectHistoryAndProduct,
      },
    },
  });

  // Clear current selected product in cart
  await prismaClient.cart.deleteMany({
    where: {
      user_id: user.user_id,
    },
  });

  return history;
}

async function list(userId) {
  userId = validate(getHistoryValidation, userId);

  const histories = await prismaClient.history.findMany({
    where: {
      user_id: userId,
    },
  });

  return histories;
}

async function get(transaction_id) {
  transaction_id = validate(getTransactionIdValidation, transaction_id);

  const history = await prismaClient.history.findFirst({
    where: {
      transaction_id,
    },
  });

  return history;
}

async function update(request) {
  request = validate(updateHistoryValidation, request);

  const history = await prismaClient.history.update({
    where: {
      transaction_id: request.transaction_id,
    },
    data: {
      transaction_id: request.transaction_id,
      transaction_detail: request.transaction_detail,
    },
    include: {
      product: true,
    },
  });

  if (!history) throw new ResponseError(404, "History not found");

  // decrease stock if transaction is success
  const transactionDetail = JSON.parse(request.transaction_detail);
  if (transactionDetail.transaction_status === "settlement") {
    history.product.forEach(async (item) => {
      await prismaClient.product.update({
        where: {
          product_id: item.product_id,
        },
        data: {
          stock_quantity: {
            decrement: item.quantity,
          },
        },
      });
    });
  }

  return history;
}

export default {
  create,
  list,
  get,
  update,
};
