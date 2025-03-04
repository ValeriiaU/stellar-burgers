import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TIngredient | null;
};

const initialState: TConstructorState = {
  ingredients: [],
  bun: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = new Date().getTime().toString();
        return {
          payload: {
            id: id,
            ...ingredient
          }
        };
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    clearConstructor: (state) => {
      (state.bun = null), (state.ingredients = []);
    },
    moveElemet: (state, action) => {
      const oldIndex = state.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload.ingredientId
      );
      const ingredient = state.ingredients[oldIndex];
      state.ingredients.splice(oldIndex, 1);
      state.ingredients.splice(action.payload.newIndex, 0, ingredient);
    }
  },
  selectors: {
    getConstructorItems: (state) => ({
      bun: state.bun,
      ingredients: state.ingredients
    })
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveElemet
} = constructorSlice.actions;
export const { getConstructorItems } = constructorSlice.selectors;
