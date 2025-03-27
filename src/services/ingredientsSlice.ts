import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '../utils/types';
import { stat } from 'fs';

export const getIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/getIngredients',
  async () => {
    try {
      return await getIngredientsApi();
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

type TIngredientsState = {
  isIngredientsLoading: boolean;
  isIngredientsLoaded: boolean;
  ingredientsData: TIngredient[];
  ingredientsDataError: null | string;
  ingredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  isIngredientsLoading: false,
  isIngredientsLoaded: false,
  ingredientsData: [],
  ingredientsDataError: null,
  ingredient: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredientsLoading: (state) => {
      state.isIngredientsLoading = true;
    },
    findIngredient: (state, action) => {
      state.ingredient =
        state.ingredientsData.find(
          (ingredient) => ingredient._id === action.payload.id
        ) || null;
    }
  },
  selectors: {
    getIngredientsData: (state) => state.ingredientsData,
    getIngredientsBun: (state) =>
      state.ingredientsData.filter((bun) => bun.type === 'bun'),
    getIngredientsMain: (state) =>
      state.ingredientsData.filter((main) => main.type === 'main'),
    getIngredientsSauce: (state) =>
      state.ingredientsData.filter((sauce) => sauce.type === 'sauce'),
    getIngredientsisLoading: (state) => state.isIngredientsLoading,
    getIngredient: (state) => state.ingredient,
    getIsIngredientsLoaded: (state) => state.isIngredientsLoaded
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.ingredientsDataError = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredientsDataError = action.error.message
          ? action.error.message
          : null;
        state.isIngredientsLoaded = false;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.isIngredientsLoaded = true;
        state.ingredientsData = action.payload;
      });
  }
});

export const { setIngredientsLoading, findIngredient } =
  ingredientsSlice.actions;
export const {
  getIngredientsData,
  getIngredientsBun,
  getIngredientsMain,
  getIngredientsSauce,
  getIngredientsisLoading,
  getIngredient,
  getIsIngredientsLoaded
} = ingredientsSlice.selectors;
