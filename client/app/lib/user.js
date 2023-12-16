"use server";
import axiosClient from "@/lib/axios";
import { cookies } from "next/headers";

export const handleLogin = async (credential) => {
  try {
    const resultUser = await axiosClient.post("/api/users/login", credential);
    const { token } = resultUser.data.data;
    cookies().set("token", token);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
