import { TConstructorIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TOrderState = {
  buns: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TOrderState = {
  buns: null,
  ingredients: []
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.buns = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    removeAllIngredients: (state) => {
      state.ingredients = [];
      state.buns = null;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredient = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index + 1];
      state.ingredients[index + 1] = ingredient;
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredient = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index - 1];
      state.ingredients[index - 1] = ingredient;
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  addBun,
  removeAllIngredients,
  moveIngredientDown,
  moveIngredientUp
} = orderSlice.actions;

export const getOrderIngredientsSelector = (state: { order: TOrderState }) =>
  state.order.ingredients;

export const getBunsSelector = (state: { order: TOrderState }) =>
  state.order.buns;

export const getIngredientsIdSelector = (state: { order: TOrderState }) => {
  const { buns, ingredients } = state.order;
  const allIngredients = [buns, ...ingredients, buns];
  const ingredientsId = allIngredients
    .map((ingredient) => ingredient?._id)
    .filter((id): id is string => id !== undefined);
  return ingredientsId;
};

export default orderSlice.reducer;
