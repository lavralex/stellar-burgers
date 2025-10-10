import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  isLoading: boolean;
  error: string | undefined;
  items: TIngredient[];
}

export const initialState: IngredientsState = {
  isLoading: false,
  error: '',
  items: []
};

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      });
  }
});

export const getIngredientsSelector = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.items;

export const isIngredientsLoadingSelector = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.isLoading;

export const getBunsSelector = (state: { ingredients: IngredientsState }) =>
  state.ingredients.items.filter((ingredient) => ingredient.type === 'bun');

export const getMainsSelector = (state: { ingredients: IngredientsState }) =>
  state.ingredients.items.filter((ingredient) => ingredient.type === 'main');

export const getSaucesSelector = (state: { ingredients: IngredientsState }) =>
  state.ingredients.items.filter((ingredient) => ingredient.type === 'sauce');

export default ingredientsSlice.reducer;
