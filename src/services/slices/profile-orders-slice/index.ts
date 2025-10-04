import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface ProfileOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchAll',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      });
  },
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileOrdersLoading: (state) => state.isLoading
  }
});

export const { getProfileOrders, getProfileOrdersLoading } =
  profileOrdersSlice.selectors;
export default profileOrdersSlice.reducer;
