import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import validate from "../validation/validation.js";
import { getCategoryValidation } from "../validation/category-validation.js";

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

async function get(categoryId) {
  categoryId = validate(getCategoryValidation, categoryId);

  return await prismaClient.category.findFirstOrThrow({
    where: {
      category_id: categoryId,
    },
    select: {
      category_id: true,
      name: true,
    },
  });
}

export default {
  list,
  get,
};
