import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  feedSlice,
  takeGetFeedsApi,
  takeGetOrdersApi,
  getOrdersIsLoaded
} from '../services/feedSlice';

describe('feedSlice/getFeedsApi', () => {
  const feedRespond = {
    success: true,
    orders: [
      {
        _id: '67e311a56fce7d001db5c321',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa0945',
          '643d69a5c3f7b9001cfa0945',
          '643d69a5c3f7b9001cfa0945',
          '643d69a5c3f7b9001cfa0945',
          '643d69a5c3f7b9001cfa0945',
          '643d69a5c3f7b9001cfa0945',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Флюоресцентный антарианский бургер',
        createdAt: '2025-03-25T20:27:17.017Z',
        updatedAt: '2025-03-25T20:27:17.699Z',
        number: 72127
      },
      {
        _id: '67e311756fce7d001db5c320',
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa093c'
        ],
        status: 'done',
        name: 'Краторный space бургер',
        createdAt: '2025-03-25T20:26:29.461Z',
        updatedAt: '2025-03-25T20:26:30.164Z',
        number: 72126
      }
    ],
    total: 71753,
    totalToday: 63
  };

  const store = configureStore({
    reducer: {
      feed: feedSlice.reducer
    }
  });
  test('should set isLoading to true on pending', async () => {
    const pendingPromise = new Promise(() => {});

    jest
      .spyOn(require('../utils/burger-api'), 'getFeedsApi')
      .mockImplementation(() => pendingPromise);

    store.dispatch(takeGetFeedsApi());

    expect(getOrdersIsLoaded(store.getState())).toBe(false);
    expect(store.getState().feed.isLoading).toBe(true);
  });

  test('should set data and request states correctly on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'getFeedsApi')
      .mockResolvedValue(feedRespond);

    await store.dispatch(takeGetFeedsApi());

    expect(getOrdersIsLoaded(store.getState())).toBe(true);
    expect(store.getState().feed.total).toBe(feedRespond.total);
  });

  test('should handle rejected action and set error message', async () => {
    const errorMessage = 'Failed';
    jest
      .spyOn(require('../utils/burger-api'), 'getFeedsApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(takeGetFeedsApi());

    expect(store.getState().feed.err).toBe(errorMessage);
    expect(getOrdersIsLoaded(store.getState())).toBe(false);
  });
});

describe('feedSlice/getOrdersApi', () => {
  jest.mock('../utils/cookie', () => ({
    getCookie: jest.fn(() => 'mockedAccessToken')
  }));

  const ordersRespond = {
    success: true,
    orders: [
      {
        _id: '67ad3f40133acd001be508cc',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa0940'
        ],
        status: 'done',
        name: 'Флюоресцентный люминесцентный метеоритный бургер',
        createdAt: '2025-02-13T00:39:28.075Z',
        updatedAt: '2025-02-13T00:39:28.722Z',
        number: 68312
      },
      {
        _id: '67ad3f63133acd001be508cd',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa0940'
        ],
        status: 'done',
        name: 'Флюоресцентный люминесцентный метеоритный бургер',
        createdAt: '2025-02-13T00:40:03.297Z',
        updatedAt: '2025-02-13T00:40:03.995Z',
        number: 68313
      }
    ],
    total: 71754,
    totalToday: 62
  };

  const store = configureStore({
    reducer: {
      feed: feedSlice.reducer
    }
  });
  test('should set isLoading to true on pending', async () => {});
  const pendingPromise = new Promise(() => {});
  jest
    .spyOn(require('../utils/burger-api'), 'getOrdersApi')
    .mockImplementation(() => pendingPromise);

  store.dispatch(takeGetOrdersApi());

  expect(store.getState().feed.isLoading).toBe(true);
  expect(getOrdersIsLoaded(store.getState())).toBe(false);

  test('should set data and request states correctly on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'getOrdersApi')
      .mockResolvedValue(ordersRespond);

    await store.dispatch(takeGetOrdersApi());

    expect(getOrdersIsLoaded(store.getState())).toBe(true);
    expect(store.getState().feed.myOrders).toEqual(ordersRespond);
  });

  test('should handle rejected action and set error message', async () => {
    const errorMessage = 'Failed';
    jest
      .spyOn(require('../utils/burger-api'), 'getOrdersApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(takeGetOrdersApi());

    expect(store.getState().feed.err).toBe(errorMessage);
    expect(getOrdersIsLoaded(store.getState())).toBe(false);
  });
});
