import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

export const takeGetFeedsApi = createAsyncThunk('feed/getFeeds', async () => {
  try {
    return getFeedsApi();
  } catch (err) {
    return Promise.reject(err);
  }
});

export const takeGetOrdersApi = createAsyncThunk('feed/getOrders', async () => {
  try {
    return getOrdersApi();
  } catch (err) {
    return Promise.reject(err);
  }
});

type TState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  err: string;
  myOrders: TOrder[];
  ordersIsLoaded: boolean;
  order: TOrder | null;
};

const initialState: TState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  err: '',
  myOrders: [],
  ordersIsLoaded: false,
  order: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    getOrderByNumber: (state, action) => {
      state.order =
        state.orders.find((order) => order.number === action.payload) || null;
    },
    getMyOrderByNumber: (state, action) => {
      state.order =
        state.myOrders.find((order) => order.number === action.payload) || null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(takeGetFeedsApi.pending, (state) => {
      state.isLoading = true;
      state.err = '';
    });
    builder.addCase(takeGetFeedsApi.rejected, (state, action) => {
      state.isLoading = false;
      state.err = action.error.message
        ? action.error.message
        : 'Sorry, something went wrong';
    });
    builder.addCase(takeGetFeedsApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.err = '';
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.ordersIsLoaded = true;
    });
    builder.addCase(takeGetOrdersApi.pending, (state) => {
      state.isLoading = true;
      state.err = '';
    });
    builder.addCase(takeGetOrdersApi.rejected, (state, action) => {
      state.isLoading = false;
      state.err = action.error.message
        ? action.error.message
        : 'Sorry, something went wrong';
    });
    builder.addCase(takeGetOrdersApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.err = '';
      state.myOrders = action.payload;
    });
  },
  selectors: {
    getOrdersSelector: (state) => state.orders,
    getFeed: (state) => ({ total: state.total, totalToday: state.totalToday }),
    getMyOrders: (state) => state.myOrders,
    getOrdersIsLoaded: (state) => state.ordersIsLoaded,
    getOrder: (state) => state.order
  }
});

export const { getOrderByNumber, getMyOrderByNumber } = feedSlice.actions;
export const {
  getOrdersSelector,
  getFeed,
  getMyOrders,
  getOrdersIsLoaded,
  getOrder
} = feedSlice.selectors;
