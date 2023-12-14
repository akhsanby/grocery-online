import { createProductValidation, getProductValidation, searchProductValidation, updateProductValidation } from "../validation/product-validation.js";
import validate from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";

async function create(request) {
  const product = validate(createProductValidation, request);

  if (product.error) {
    throw new ResponseError(400, product.error.details);
  }

  // menyisipkan data product
  const newProduct = await prismaClient.product.create({
    data: product,
  });

  // menampilkan satu produk dari tabel produk
  const selectedProduct = await prismaClient.product.findUnique({
    where: {
      product_id: newProduct.product_id,
    },
  });

  // menampilkan suatu entitas dari tabel produk
  const productCategory = await prismaClient.category.findUnique({
    where: {
      category_id: selectedProduct.category_id,
    },
  });

  return {
    name: selectedProduct.name,
    description: selectedProduct.description,
    price: selectedProduct.price,
    stock_quantity: selectedProduct.stock_quantity,
    thumbnail: selectedProduct.thumbnail,
    category: productCategory.name,
  };
}

async function search(request) {
  request = validate(searchProductValidation, request);

  if (request.error) {
    throw new ResponseError(400, request.error.details);
  }

  const skip = (request.page - 1) * request.size;

  const whereClause = {};

  if (request.name) {
    whereClause.name = {
      contains: request.name,
    };
  }

  if (request.category_id) {
    whereClause.category_id = request.category_id;
  }

  const products = await prismaClient.product.findMany({
    where: whereClause,
    take: request.size,
    skip: skip,
    orderBy: [
      {
        updated_at: "desc",
      },
      {
        created_at: "desc",
      },
    ],
  });

  const totalItems = await prismaClient.product.count({
    where: whereClause,
  });

  return {
    data: products,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
}

async function update(request) {
  const product = validate(updateProductValidation, request);

  if (product.error) {
    throw new ResponseError(400, product.error.details);
  }

  // mengupdate yang dipilih satu produk dari tabel produk
  const selectedProduct = await prismaClient.product.update({
    where: {
      product_id: product.product_id,
    },
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      thumbnail: product.thumbnail,
      category_id: product.category_id,
    },
  });

  // menampilkan satu entitas dari tabel produk yang telah diupdate
  const productCategory = await prismaClient.category.findUnique({
    where: {
      category_id: selectedProduct.category_id,
    },
  });

  return {
    name: selectedProduct.name,
    description: selectedProduct.description,
    price: selectedProduct.price,
    stock_quantity: selectedProduct.stock_quantity,
    thumbnail: selectedProduct.thumbnail,
    category: productCategory.name,
  };
}

async function remove(productId) {
  productId = validate(getProductValidation, productId);

  const totalInDatabase = await prismaClient.product.count({
    where: {
      product_id: productId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Product is not found");
  }

  return await prismaClient.product.delete({
    where: {
      product_id: productId,
    },
  });
}

async function get(productId) {
  productId = validate(getProductValidation, productId);

  if (productId.error) {
    throw new ResponseError(400, productId.error.details);
  }

  const product = await prismaClient.product.findFirst({
    where: {
      product_id: productId,
    },
  });

  if (!product) {
    throw new ResponseError(404, "Product is not found");
  }

  // menampilkan satu entitas dari tabel produk
  const productCategory = await prismaClient.category.findUnique({
    where: {
      category_id: product.category_id,
    },
  });

  return {
    product_id: product.product_id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock_quantity: product.stock_quantity,
    thumbnail: product.thumbnail,
    category: productCategory.name,
  };
}

export default {
  create,
  search,
  update,
  remove,
  get,
};
