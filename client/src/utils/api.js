import axiosClient from "./axios-client.js";
import { store } from "@/app/store.js";
import { setCurrentCategories, setCurrentProducts, setPageNumbers } from "@/app/features/product-slice.js";
import { setCurrentCart } from "@/app/features/cart-slice.js";

export const getCategories = async (token) => {
  const result = await axiosClient.get("/api/category", {
    headers: { Authorization: token },
  });
  const { data: categories } = result.data;
  store.dispatch(setCurrentCategories({ categories }));
};

export const createProduct = async (token, data) => {
  const { name, description, price, stock_quantity, category_id } = data;
  await axiosClient.post(
    "/api/product",
    {
      name,
      description,
      price,
      stock_quantity,
      thumbnail: "https://placehold.co/400x200",
      category_id,
    },
    {
      headers: { Authorization: token },
    }
  );
};

export const updateProduct = async (token, data) => {
  const { product_id, name, description, price, stock_quantity, category_id } = data;
  return await axiosClient.put(
    `/api/product/${product_id}`,
    {
      name,
      description,
      price,
      stock_quantity,
      thumbnail: "https://placehold.co/400x200",
      category_id,
    },
    {
      headers: { Authorization: token },
    }
  );
};

export const getProducts = async (token, page = 1, size = 12, keyword = "") => {
  let result;
  if (keyword) {
    result = await axiosClient.get(`/api/product?page=${page}&size=${size}&name=${keyword}`, {
      headers: { Authorization: token },
    });
  } else {
    result = await axiosClient.get(`/api/product?page=${page}&size=${size}`, {
      headers: { Authorization: token },
    });
  }
  const { data: products, paging } = result.data;
  store.dispatch(setCurrentProducts({ products, paging }));
  store.dispatch(setPageNumbers({ totalPage: paging.total_page }));
};

export const removeProduct = async (token, productId) =>
  axiosClient.delete(`/api/product/${productId}`, {
    headers: { Authorization: token },
  });

export const getProductsByCategory = async (token, categoryId, page = 1, size = 12, keyword = "") => {
  let result;
  if (keyword) {
    result = await axiosClient.get(`/api/product?category_id=${categoryId}&page=${page}&size=${size}&name=${keyword}`, {
      headers: { Authorization: token },
    });
  } else {
    result = await axiosClient.get(`/api/product?category_id=${categoryId}&page=${page}&size=${size}`, {
      headers: { Authorization: token },
    });
  }
  const { data: products, paging } = result.data;
  store.dispatch(setCurrentProducts({ products, paging }));
  store.dispatch(setPageNumbers({ totalPage: paging.total_page }));
};

export const getCart = async (token, userId) => {
  const result = await axiosClient.get(`/api/cart/${userId}`, {
    headers: { Authorization: token },
  });
  const { data: carts, count } = result.data;
  store.dispatch(setCurrentCart({ carts, count }));
};

export const createCart = async (token, data) => {
  const { user_id, product_id, quantity } = data;
  return await axiosClient.post(
    "/api/cart",
    { user_id, product_id, quantity },
    {
      headers: { Authorization: token },
    }
  );
};

export const updateCart = async (token, data, cartId) => {
  const { quantity } = data;
  return await axiosClient.patch(
    `/api/cart/${cartId}`,
    { quantity },
    {
      headers: { Authorization: token },
    }
  );
};
