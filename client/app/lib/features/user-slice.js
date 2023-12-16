import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredential: (state, { payload }) => {
      state.credential = { ...state.credential, ...payload };
    },
    setRegisterData: (state, { payload }) => {
      state.registerData = { ...state.registerData, ...payload };
    },
  },
});

export const { setCredential, setRegisterData } = userSlice.actions;

export default userSlice.reducer;
