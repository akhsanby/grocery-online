import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios-client";
import nookies from "nookies";

export const getProducts = createAsyncThunk("product/getProducts", async (queryParams = {}, thunkAPI) => {
  const { token } = nookies.get();
  const result = await axiosClient.get("/api/product", {
    headers: { Authorization: token },
    params: queryParams,
  });
  const { data, paging } = result.data;
  return { data, paging };
});

const initialState = {
  searchKeyword: "",
  activePage: 1,
  activeCategory: {
    category_id: undefined,
    name: "",
  },
  pageNumbers: undefined,
  products: {
    data: [],
    paging: {},
  },
  showDetailModal: false,
  showCreateModal: false,
  selectedProduct: {
    product_id: 0,
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    category_id: 0,
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },
    setActiveCategory: (state, { payload }) => {
      state.activeCategory = {
        category_id: payload.category_id,
        name: payload.name,
      };
    },
    setPageNumbers: (state, { payload }) => {
      state.pageNumbers = Array.from({ length: payload.totalPage }, (_, index) => index + 1);
    },
    setCurrentProducts: (state, { payload }) => {
      state.currentProducts.data = payload.products;
      state.currentProducts.paging = payload.paging;
    },
    setCurrentCategories: (state, { payload }) => {
      state.currentCategories.data = payload.categories;
    },
    toggleDetailModal: (state) => {
      state.showDetailModal = !state.showDetailModal;
    },
    toggleCreateModal: (state) => {
      state.showCreateModal = !state.showCreateModal;
    },
    setSelectedProduct: (state, { payload }) => {
      state.selectedProduct = { ...state.selectedProduct, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      const { data, paging } = action.payload;
      state.products.data = data;
      state.products.paging = paging;

      state.pageNumbers = Array.from({ length: paging.total_page }, (_, index) => index + 1);
    });
  },
});

export const { setSearchKeyword, setActivePage, setActiveCategory, setPageNumbers, setCurrentProducts, setCurrentCategories, toggleDetailModal, toggleCreateModal, handleCloseModal, handleShowModal, setSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
