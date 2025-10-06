import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface ProfileOrdersState {
  orders: TOrder[];
  orderByNumber: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: ProfileOrdersState = {
  orders: [],
  orderByNumber: null,
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

export const getOrderByNumber = createAsyncThunk(
  'profileOrders/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
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
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderByNumber = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileOrdersLoading: (state) => state.isLoading,
    getOrderByNumberSelector: (state) => state.orderByNumber
  }
});

export const {
  getProfileOrders,
  getProfileOrdersLoading,
  getOrderByNumberSelector
} = profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
