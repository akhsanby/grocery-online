import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios-client";
import nookies from "nookies";

export const getHistories = createAsyncThunk("history/getHistories", async (userId) => {
  const { token } = nookies.get();
  const result = await axiosClient.get(`/api/history/${userId}`, {
    headers: { Authorization: token },
  });
  const { data } = result.data;
  return data;
});

export const getHistory = createAsyncThunk("history/getHistory", async (transactionId) => {
  const { token } = nookies.get();
  const result = await axiosClient.get(`/api/history/${transactionId}/transaction`, {
    headers: { Authorization: token },
  });
  const { data } = result.data;
  return data;
});

const initialState = {
  histories: [],
  history: {},
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHistories.fulfilled, (state, action) => {
      state.histories = action.payload;
    });
    builder.addCase(getHistory.fulfilled, (state, action) => {
      state.history = {
        ...action.payload,
        transaction_detail: JSON.parse(action.payload.transaction_detail),
      };
    });
  },
});

export const {} = historySlice.actions;

export default historySlice.reducer;
