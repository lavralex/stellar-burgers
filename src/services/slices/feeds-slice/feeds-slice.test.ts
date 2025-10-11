import feedsReducer, { fetchFeeds, initialState } from './index';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('Слайс ленты заказов', () => {

  it('должен возвращать начальное состояние', () => {
    expect(feedsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать isLoading в true при fetchFeeds.pending', () => {
    const action = fetchFeeds.pending('requestId');
    const state = feedsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать данные и isLoading в false при fetchFeeds.fulfilled', () => {
    const mockData = {
      success: true,
      orders: [
        {
          _id: '1',
          ingredients: [],
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '2024-10-11',
          updatedAt: '2024-10-11',
          number: 12345
        } as TOrder
      ],
      total: 100,
      totalToday: 10
    };

    const state = feedsReducer(
      initialState,
      fetchFeeds.fulfilled(mockData, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockData.orders);
    expect(state.total).toBe(mockData.total);
    expect(state.totalToday).toBe(mockData.totalToday);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать ошибку и isLoading в false при fetchFeeds.rejected', () => {
    const errorMessage = 'Ошибка загрузки ленты заказов';
    const error = new Error(errorMessage);

    const state = feedsReducer(
      initialState,
      fetchFeeds.rejected(error, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
