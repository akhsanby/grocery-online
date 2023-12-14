import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchKeyword: "",
  activePage: 1,
  activeCategory: undefined,
  pageNumbers: undefined,
  currentProducts: {
    data: [],
    paging: {},
  },
  currentCategories: {
    data: [],
  },
  showDetailModal: false,
  showCreateModal: false,
  product: {
    product_id: 0,
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    category_id: 0,
  },
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
    setActiveCategory: (state, action) => {
      state.activePage = 1;
      state.activeCategory = action.payload;
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
    updateProduct: (state, { payload }) => {
      state.product = { ...state.product, ...payload };
    },
    setSelectedProduct: (state, { payload }) => {
      state.selectedProduct = { ...state.selectedProduct, ...payload };
    },
  },
});

export const { setSearchKeyword, setActivePage, setActiveCategory, setPageNumbers, setCurrentProducts, setCurrentCategories, toggleDetailModal, toggleCreateModal, handleCloseModal, handleShowModal, updateProduct, setSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
