import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

type TMakeOrder = {
  orderRequest: boolean;
  error: string;
  orderModalData: TOrder | null;
};

const initialState: TMakeOrder = {
  orderRequest: false,
  error: '',
  orderModalData: null
};

export const getOrderBurgerApi = createAsyncThunk(
  'makeOrder/getOrderBurgerApi',
  async (data: string[]) => {
    try {
      return await orderBurgerApi(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const makeOrderSlice = createSlice({
  name: 'makeOrder',
  initialState,
  reducers: {
    closeModal: (state) => {
      state.orderModalData = null;
    },
    cancelOrder: (state) => {
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderBurgerApi.pending, (state) => {
      state.orderRequest = true;
      state.error = '';
    });
    builder.addCase(getOrderBurgerApi.rejected, (state, action) => {
      state.error = action.error.message
        ? action.error.message
        : 'Sorry, something went wrong';
    });
    builder.addCase(getOrderBurgerApi.fulfilled, (state, action) => {
      state.error = '';
      state.orderRequest = false;
      state.orderModalData = action.payload.order;
    });
  },
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData
  }
});

export const { closeModal, cancelOrder } = makeOrderSlice.actions;
export const { getOrderRequest, getOrderModalData } = makeOrderSlice.selectors;
