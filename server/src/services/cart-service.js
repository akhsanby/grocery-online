import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { createCartValidation, getCartValidation, updateCartValidation } from "../validation/cart-validation.js";
import validate from "../validation/validation.js";

async function create(request) {
  request = validate(createCartValidation, request);

  const existingData = await prismaClient.cart.findFirst({
    where: {
      product_id: request.product_id,
      AND: {
        user_id: request.user_id,
      },
    },
  });

  if (!existingData) {
    try {
      const cart = await prismaClient.cart.create({
        data: {
          user_id: request.user_id,
          product_id: request.product_id,
          quantity: request.quantity,
        },
      });

      return cart;
    } catch (error) {
      throw new ResponseError(400, "This product is already add to cart");
    }
  }
}

async function get(userId) {
  userId = validate(getCartValidation, userId);

  const carts = await prismaClient.cart.findMany({
    where: {
      user_id: userId,
    },
    include: {
      user: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          address: true,
          phone_number: true,
        },
      },
      product: true,
    },
  });

  const totalInDatabase = await prismaClient.cart.count({
    where: {
      user_id: userId,
    },
  });

  return {
    data: carts,
    count: totalInDatabase,
  };
}

async function update(request) {
  request = validate(updateCartValidation, request);

  const totalInDatabase = await prismaClient.cart.count({
    where: {
      cart_id: request.cart_id,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Product is not found");
  }

  const cart = await prismaClient.cart.update({
    where: {
      cart_id: request.cart_id,
    },
    data: {
      quantity: request.quantity,
    },
  });

  return cart;
}

async function remove(cartId) {
  cartId = validate(getCartValidation, cartId);

  const totalInDatabase = await prismaClient.cart.count({
    where: {
      cart_id: cartId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Product is not found");
  }

  return await prismaClient.cart.delete({
    where: {
      cart_id: cartId,
    },
  });
}

export default {
  create,
  get,
  update,
  remove,
};
