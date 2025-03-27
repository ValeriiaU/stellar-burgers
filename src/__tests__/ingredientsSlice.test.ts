import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice, getIngredients } from '../services/ingredientsSlice';

describe('ingredientsSlice', () => {
  const ingredientsJson = {
    success: true,
    data: [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        __v: 0
      }
    ]
  };

  const store = configureStore({
    reducer: {
      ingredients: ingredientsSlice.reducer
    }
  });

  test('should set isIngredientsLoading to true on pending', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'getIngredientsApi')
      .mockResolvedValue(undefined);

    const action = store.dispatch(getIngredients());

    expect(store.getState().ingredients.isIngredientsLoading).toBe(true);
  });

  test('should set data and loading states correctly on fulfilled', async () => {
    jest
      .spyOn(require('../utils/burger-api'), 'getIngredientsApi')
      .mockResolvedValue(ingredientsJson.data);

    await store.dispatch(getIngredients());

    const state = store.getState().ingredients;
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.isIngredientsLoaded).toBe(true);
    expect(state.ingredientsData).toEqual(ingredientsJson.data);
  });

  test('should handle rejected action and set error message', async () => {
    const errorMessage = 'Failed';

    jest
      .spyOn(require('../utils/burger-api'), 'getIngredientsApi')
      .mockRejectedValueOnce(new Error(errorMessage)); // mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(getIngredients());

    const state = store.getState().ingredients;

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.isIngredientsLoaded).toBe(false);
    expect(state.ingredientsDataError).toBe(errorMessage);
  });
});
