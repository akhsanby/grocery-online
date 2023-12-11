import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/app/features/product-slice.js";
import userReducer from "@/app/features/user-slice.js";

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
  },
});
