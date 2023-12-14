import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validation/user-validation.js";
import validate from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

const secretKey = "sangatRahasia";

async function register(request) {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) throw new ResponseError(400, "Email already registered");

  // do password hash with bcrypt
  user.password = await bcrypt.hash(user.password, 10);

  return await prismaClient.user.create({
    data: user,
    select: {
      first_name: true,
      last_name: true,
      email: true,
      user_level_id: true,
    },
  });
}

async function login(request) {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });

  // if user not found
  if (!user) throw new ResponseError(401, "Email or password wrong");

  const userLevel = await prismaClient.userLevel.findUnique({
    where: {
      user_level_id: user.user_level_id,
    },
    select: {
      level_name: true,
    },
  });

  // do password compare with bcrypt
  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
  if (!isPasswordValid) throw new ResponseError(401, "Email or password wrong");

  // create token when login success
  const userPayload = {
    userId: user.user_id,
    userLevel: userLevel.level_name,
    firstName: user.first_name,
    lastName: user.last_name,
  };

  const token = jwt.sign(userPayload, secretKey, { expiresIn: "1d" });

  return await prismaClient.user.update({
    data: {
      token,
    },
    where: {
      email: user.email,
    },
    select: {
      token: true,
    },
  });
}

const get = async (email) => {
  email = validate(getUserValidation, email);

  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
    select: {
      first_name: true,
      last_name: true,
      email: true,
      address: true,
      phone_number: true,
      user_level_id: true,
    },
  });

  const userLevel = await prismaClient.userLevel.findUnique({
    where: {
      user_level_id: user.user_level_id,
    },
  });

  if (!user) throw new ResponseError(404, "User not found");

  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    address: user.address,
    phone_number: user.phone_number,
    user_level: userLevel.level_name,
  };
};

const update = async (request) => {
  const user = validate(updateUserValidation, request);

  const totaluserInDatabase = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (totaluserInDatabase !== 1) throw new ResponseError(404, "User is not found");

  const data = {};

  if (user.first_name) {
    data.first_name = user.first_name;
  }

  if (user.last_name) {
    data.last_name = user.last_name;
  }

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  if (user.address) {
    data.address = user.address;
  }

  if (user.phone_number) {
    data.phone_number = user.phone_number;
  }

  return await prismaClient.user.update({
    where: {
      email: user.email,
    },
    data: data,
    select: {
      first_name: true,
      last_name: true,
      email: true,
      address: true,
      phone_number: true,
    },
  });
};

const logout = async (email) => {
  email = validate(getUserValidation, email);

  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) throw new ResponseError(404, "User is not found");

  return await prismaClient.user.update({
    where: {
      email: user.email,
    },
    data: {
      token: null,
    },
    select: {
      email: true,
    },
  });
};

export default {
  register,
  login,
  get,
  update,
  logout,
};
