import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCarts: {
    data: [],
    count: 0,
  },
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCurrentCart: (state, { payload }) => {
      state.currentCarts.data = payload.carts;
      state.currentCarts.count = payload.count;
    },
  },
});

export const { setCurrentCart } = cartSlice.actions;

export default cartSlice.reducer;
