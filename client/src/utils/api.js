import axiosClient from "./axios-client.js";
import nookies from "nookies";

export const updateUser = async (data) => {
  const { token } = nookies.get();
  const { first_name, last_name, email, phone_number, address } = data;
  return await axiosClient.patch(
    `/api/users/current`,
    {
      first_name,
      last_name,
      email,
      phone_number,
      address,
    },
    {
      headers: { Authorization: token },
    }
  );
};

export const updateUserPassword = async (data) => {
  const { token } = nookies.get();
  const { email, password } = data;
  return await axiosClient.put(
    `/api/users/change-password`,
    {
      email,
      password,
    },
    {
      headers: { Authorization: token },
    }
  );
};

export const createProduct = async (data) => {
  const { token } = nookies.get();
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

export const updateProduct = async (data) => {
  const { token } = nookies.get();
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

export const removeProduct = async (productId) => {
  const { token } = nookies.get();
  return await axiosClient.delete(`/api/product/${productId}`, {
    headers: { Authorization: token },
  });
};

export const createCart = async (data) => {
  const { token } = nookies.get();
  const { user_id, product_id, quantity } = data;
  return await axiosClient.post(
    "/api/cart",
    { user_id, product_id, quantity },
    {
      headers: { Authorization: token },
    }
  );
};

export const updateCart = async (data, cartId) => {
  const { token } = nookies.get();
  const { quantity } = data;
  return await axiosClient.patch(
    `/api/cart/${cartId}`,
    { quantity },
    {
      headers: { Authorization: token },
    }
  );
};

export const deleteCart = async (cartId) => {
  const { token } = nookies.get();
  return await axiosClient.delete(`/api/cart/${cartId}`, {
    headers: { Authorization: token },
  });
};

export const createTransaction = async (data) => {
  const { token } = nookies.get();
  return await axiosClient.post("/api/transaction", data, {
    headers: { Authorization: token },
  });
};

export const getTransaction = async (transactionId) => {
  const { token } = nookies.get();
  return await axiosClient.get(`/api/transaction/${transactionId}`, {
    headers: { Authorization: token },
  });
};

export const createHistory = async (data) => {
  const { token } = nookies.get();
  return await axiosClient.post("/api/history", data, {
    headers: { Authorization: token },
  });
};

export const updateHistory = async (data) => {
  const { token } = nookies.get();
  return await axiosClient.put("/api/history", data, {
    headers: { Authorization: token },
  });
};
