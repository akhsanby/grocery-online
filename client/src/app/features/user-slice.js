import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios-client";
import nookies from "nookies";

export const getCurrentUser = createAsyncThunk("user/getCurrentUser", async () => {
  const { token } = nookies.get();
  const result = await axiosClient.get("/api/users/current", {
    headers: { Authorization: token },
  });
  const { data } = result.data;
  return data;
});

const initialState = {
  alert: {
    show: false,
    variant: "",
    message: "",
  },
  credential: {
    email: "",
    password: "",
  },
  registerData: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_level_id: 2, // 1 is admin, 2 is customer
  },
  currentUser: {
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone_number: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleAlert: (state, action) => {
      const { isShow, variant = "", message = "" } = action.payload;
      if (isShow === "show") {
        state.alert.show = true;
        state.alert.variant = variant;
        state.alert.message = message;
      } else if (isShow === "hide") {
        state.alert.show = false;
        state.alert.variant = variant;
        state.alert.message = message;
      }
    },
    setCredential: (state, { payload }) => {
      state.credential = { ...state.credential, ...payload };
    },
    setRegisterData: (state, { payload }) => {
      state.registerData = { ...state.registerData, ...payload };
    },
    setCurrentUser: (state, { payload }) => {
      state.currentUser = { ...state.currentUser, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      const { first_name, last_name, email, address, phone_number } = action.payload;
      state.currentUser = { first_name, last_name, email, address: address ?? "", phone_number: phone_number ?? "" };
    });
  },
});

export const { toggleAlert, setCredential, setRegisterData, setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
