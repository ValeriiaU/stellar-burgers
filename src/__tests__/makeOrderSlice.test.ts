import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  makeOrderSlice,
  getOrderBurgerApi,
  getOrderRequest
} from '../services/makeOrderSlice';

describe('makeOrderSlice', () => {
  const orderDataRespond = {
    success: true,
    name: 'Space флюоресцентный люминесцентный метеоритный бургер',
    order: {
      ingredients: [
        {
          _id: '643d69a5c3f7b9001cfa093d',
          name: 'Флюоресцентная булка R2-D3',
          type: 'bun',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/bun-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa093e',
          name: 'Филе Люминесцентного тетраодонтимформа',
          type: 'main',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/meat-03.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-03-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa0940',
          name: 'Говяжий метеорит (отбивная)',
          type: 'main',
          proteins: 800,
          fat: 800,
          carbohydrates: 300,
          calories: 2674,
          price: 3000,
          image: 'https://code.s3.yandex.net/react/code/meat-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-04-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa0943',
          name: 'Соус фирменный Space Sauce',
          type: 'sauce',
          proteins: 50,
          fat: 22,
          carbohydrates: 11,
          calories: 14,
          price: 80,
          image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-04-large.png',
          __v: 0
        }
      ],
      _id: '67ddc75a6fce7d001db5b6cf',
      owner: {
        name: 'someName',
        email: 'someEmail@yandex.ru',
        createdAt: '2025-02-09T23:32:37.103Z',
        updatedAt: '2025-02-13T22:08:05.240Z'
      },
      status: 'done',
      name: 'Space флюоресцентный люминесцентный метеоритный бургер',
      createdAt: '2025-03-21T20:08:58.070Z',
      updatedAt: '2025-03-21T20:08:58.842Z',
      number: 71793,
      price: 5056
    }
  };

  const store = configureStore({
    reducer: {
      makeOrder: makeOrderSlice.reducer
    }
  });

  test('should set orderRequest to true on pending', async () => {
    const pendingPromise = new Promise(() => {});
    jest
      .spyOn(require('../utils/burger-api'), 'orderBurgerApi')
      .mockImplementation(() => pendingPromise);

    store.dispatch(getOrderBurgerApi([]));
    expect(getOrderRequest(store.getState())).toBe(true);
  });

  test('should set data and request states correctly on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'orderBurgerApi')
      .mockResolvedValue(orderDataRespond);

    await store.dispatch(
      getOrderBurgerApi([
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa0943'
      ])
    );

    expect(getOrderRequest(store.getState())).toBe(false);
    expect(store.getState().makeOrder.orderModalData).toEqual(
      orderDataRespond.order
    );
  });

  test('should handle rejected action and set error message', async () => {
    const errorMessage = 'Failed';

    jest
      .spyOn(require('../utils/burger-api'), 'orderBurgerApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(getOrderBurgerApi([]));

    expect(store.getState().makeOrder.error).toBe(errorMessage);
    expect(getOrderRequest(store.getState())).toBe(false);
  });
});
