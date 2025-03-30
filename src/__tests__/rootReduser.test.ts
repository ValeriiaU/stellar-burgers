import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../services/ingredientsSlice';
import { constructorSlice } from '../services/constructorSlice';
import { makeOrderSlice } from '../services/makeOrderSlice';
import { userSlice } from '../services/userSlice';
import { feedSlice } from '../services/feedSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  userSlice,
  makeOrderSlice,
  feedSlice
);

describe('rootReducer', () => {
  test('should return the initial state when called with undefined state and an unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const store = configureStore({ reducer: rootReducer });

    expect(initialState).toEqual(store.getState());
  });
});
