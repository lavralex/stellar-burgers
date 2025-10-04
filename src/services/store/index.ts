import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from '../slices/ingredients-slice';
import burgerConstructorReducer from '../slices/burger-constructor-slice';
import createOrderReducer from '../slices/create-order-slice';
import userReducer from '../slices/user-slice';
import feedsReducer from '../slices/feeds-slice';
import profileOrdersReducer from '../slices/profile-orders-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  createOrder: createOrderReducer,
  user: userReducer,
  feeds: feedsReducer,
  profileOrders: profileOrdersReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
