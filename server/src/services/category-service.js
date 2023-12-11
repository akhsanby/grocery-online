import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { getCategoryValidation } from "../validation/category-validation.js";
import validate from "../validation/validation.js";

async function list() {
  const categories = await prismaClient.category.findMany({
    select: {
      category_id: true,
      name: true,
    },
  });

  if (!categories) {
    throw new ResponseError(404, "Category is not found");
  }

  return categories;
}

async function get(request) {
  request = validate(getCategoryValidation, request);

  const skip = (request.page - 1) * request.size;

  const productsByCategory = await prismaClient.product.findMany({
    where: {
      category_id: request.category_id,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.product.count({
    where: { category_id: request.category_id },
  });

  if (!productsByCategory) throw new ResponseError(404, "Product not found");

  return {
    products: productsByCategory,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
}

export default {
  list,
  get,
};
