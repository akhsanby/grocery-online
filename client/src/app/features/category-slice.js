import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios-client";
import nookies from "nookies";

export const getCategories = createAsyncThunk("category/getCategories", async () => {
  const { token } = nookies.get();
  const result = await axiosClient.get("/api/category", {
    headers: { Authorization: token },
  });
  const { data } = result.data;
  return data;
});

const initialState = {
  activeCategory: {},
  categories: {
    data: [],
  },
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      const data = action.payload;
      const customData = { category_id: 0, name: "All Products" };
      data.unshift(customData);
      state.categories.data = data;
    });
  },
});

export const { setActiveCategory } = categorySlice.actions;

export default categorySlice.reducer;
