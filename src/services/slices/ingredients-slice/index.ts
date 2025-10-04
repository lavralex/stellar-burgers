import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  },
  selectors: {
    getIngredients: (state) => state.items,
    getIngredientsLoading: (state) => state.isLoading,
    getBuns: (state) => state.items.filter((item) => item.type === 'bun'),
    getMains: (state) => state.items.filter((item) => item.type === 'main'),
    getSauces: (state) => state.items.filter((item) => item.type === 'sauce')
  }
});

export const {
  getIngredients,
  getIngredientsLoading,
  getBuns,
  getMains,
  getSauces
} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
