import { prismaClient } from "../src/app/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const removeTestProduct = async () => {
  await prismaClient.product.deleteMany({
    where: {
      name: "test",
    },
  });
};

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      first_name: "test",
      last_name: "test",
      email: "test@gmail.com",
      address: "Jalan merdeka",
      phone_number: "123456789",
      password: await bcrypt.hash("rahasia", 10),
      token: "test",
      user_level_id: 1,
    },
  });
};

export const createTestProduct = async () => {
  await prismaClient.product.create({
    data: {
      name: "test",
      description: "ini hanya testing",
      price: "1000",
      stock_quantity: 123,
      thumbnail: "http://test.com",
      category_id: 1,
    },
  });
};

export const getTestUser = async () => {
  return await prismaClient.user.findUnique({
    where: {
      email: "test@gmail.com",
    },
  });
};

export const getCategory = async (id) => {
  return await prismaClient.category.findUnique({
    where: {
      category_id: id,
    },
  });
};

export const createManyTestProduct = async () => {
  for (let i = 1; i <= 10; i++) {
    await prismaClient.product.create({
      data: {
        name: `test${i}`,
        description: `ini hanya test ke-${i}`,
        price: `${i}00`,
        stock_quantity: 122,
        thumbnail: `http://test${i}.com`,
        category_id: i,
      },
    });
  }
};

export const removeAllTestProduct = async () => {
  return await prismaClient.product.deleteMany({
    where: {
      name: {
        contains: "test",
      },
    },
  });
};

export const getTestProduct = async () => {
  return await prismaClient.product.findFirst({
    where: {
      name: "test",
    },
  });
};
