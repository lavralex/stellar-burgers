import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

interface CreateOrderState {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: CreateOrderState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

const createOrderSlice = createSlice({
  name: 'createOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  },
  selectors: {
    getOrderData: (state) => state.orderData,
    getOrderLoading: (state) => state.isLoading,
    getOrderError: (state) => state.error
  }
});

export const { clearOrder } = createOrderSlice.actions;
export const { getOrderData, getOrderLoading, getOrderError } =
  createOrderSlice.selectors;
export default createOrderSlice.reducer;
