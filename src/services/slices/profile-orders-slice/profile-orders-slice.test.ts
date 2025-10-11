import profileOrdersReducer, { fetchProfileOrders, initialState } from './index';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  getProfileOrdersApi: jest.fn()
}));

describe('Слайс заказов профиля', () => {

  it('должен возвращать начальное состояние', () => {
    expect(profileOrdersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать isLoading в true при fetchProfileOrders.pending', () => {
    const action = fetchProfileOrders.pending('requestId');
    const state = profileOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать orders и isLoading в false при fetchProfileOrders.fulfilled', () => {
    const mockOrders = [
      {
        _id: '1',
        ingredients: [],
        status: 'done',
        name: 'Тестовый заказ 1',
        createdAt: '2024-10-11',
        updatedAt: '2024-10-11',
        number: 12345
      } as TOrder,
      {
        _id: '2',
        ingredients: [],
        status: 'pending',
        name: 'Тестовый заказ 2',
        createdAt: '2024-10-11',
        updatedAt: '2024-10-11',
        number: 12346
      } as TOrder
    ];

    const state = profileOrdersReducer(
      initialState,
      fetchProfileOrders.fulfilled(mockOrders, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать error и isLoading в false при fetchProfileOrders.rejected', () => {
    const errorMessage = 'Ошибка загрузки заказов профиля';
    const error = new Error(errorMessage);

    const state = profileOrdersReducer(
      initialState,
      fetchProfileOrders.rejected(error, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
