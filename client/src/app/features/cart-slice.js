import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios-client";
import nookies from "nookies";
import _ from "lodash";

export const getCarts = createAsyncThunk("cart/getCarts", async (userId) => {
  const { token } = nookies.get();
  const result = await axiosClient.get(`/api/cart/${userId}`, {
    headers: { Authorization: token },
  });
  const { data, count } = result.data;
  return { data, count };
});

const initialState = {
  carts: {
    data: [],
    count: 0,
  },
  checkOutItem: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCurrentCarts: (state, { payload }) => {
      state.carts.data = payload.carts;
      state.carts.count = payload.count;
    },
    setCheckOutItem: (state, action) => {
      state.checkOutItem.unshift(action.payload);
    },
    removeCheckOutItem: (state, action) => {
      const cartId = action.payload;
      const newArray = state.checkOutItem.filter((item) => item.cart_id !== cartId);
      state.checkOutItem = newArray;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCarts.fulfilled, (state, action) => {
      const { data, count } = action.payload;
      state.carts.data = data;
      state.carts.count = count;
    });
  },
});

export const { setCurrentCarts, setCheckOutItem, removeCheckOutItem } = cartSlice.actions;

export default cartSlice.reducer;
