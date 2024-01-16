import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/app/features/product-slice.js";
import userReducer from "@/app/features/user-slice.js";
import categoryReducer from "@/app/features/category-slice.js";
import cartReducer from "@/app/features/cart-slice.js";
import historyReducer from "@/app/features/history-slice.js";

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    category: categoryReducer,
    cart: cartReducer,
    history: historyReducer,
  },
});
