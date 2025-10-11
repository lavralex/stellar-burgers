import reducer, { getIngredients, initialState } from './index';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  }
];

describe('[ingredients] тесты слайса ингредиентов', () => {
  describe('тесты асинхронных экшенов', () => {
    it('должен обрабатывать getIngredients.pending', () => {
      const action = { type: getIngredients.pending.type };
      const result = reducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe('');
    });

    it('должен обрабатывать getIngredients.fulfilled', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = reducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.items).toEqual(mockIngredients);
      expect(result.error).toBe('');
    });

    it('должен обрабатывать getIngredients.rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const result = reducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.items).toEqual([]);
    });
  });
});
