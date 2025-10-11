import createOrderReducer, { createOrder, clearOrder, initialState } from './index';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('Слайс создания заказа', () => {

  it('должен возвращать начальное состояние', () => {
    expect(createOrderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать isLoading в true при createOrder.pending', () => {
    const state = createOrderReducer(initialState, createOrder.pending('', []));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать orderData и isLoading в false при createOrder.fulfilled', () => {
    const mockOrder = {
      _id: '123',
      ingredients: [],
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2007-07-07',
      updatedAt: '2007-07-07',
      number: 12345
    } as TOrder;

    const state = createOrderReducer(
      initialState,
      createOrder.fulfilled(mockOrder, '', [])
    );
    expect(state.isLoading).toBe(false);
    expect(state.orderData).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать error и isLoading в false при createOrder.rejected', () => {
    const errorMessage = 'Не удалось создать заказ';
    const state = createOrderReducer(
      initialState,
      createOrder.rejected(new Error(errorMessage), '', [])
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('должен очищать orderData при действии clearOrder', () => {
    const mockOrder = {
      _id: '123',
      ingredients: [],
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2007-07-07',
      updatedAt: '2007-07-07',
      number: 12345
    } as TOrder;

    const stateWithOrder = {
      orderData: mockOrder,
      isLoading: false,
      error: null
    };

    const state = createOrderReducer(stateWithOrder, clearOrder());
    expect(state.orderData).toBeNull();
  });
});
