import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './index';
import { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
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
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  id: 'bun-1'
};

const mockIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  id: 'ingredient-1'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('[burgerConstructor] тесты слайса конструктора бургеров', () => {
  describe('тесты синхронных экшенов', () => {
    it('должен возвращать начальное состояние', () => {
      const result = reducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });

    it('должен обрабатывать добавление булочки', () => {
      const result = reducer(initialState, addBun(mockBun));

      expect(result.bun).toEqual(mockBun);
      expect(result.ingredients).toEqual([]);
    });

    it('должен обрабатывать добавление ингредиента', () => {
      const result = reducer(initialState, addIngredient(mockIngredient));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual(mockIngredient);
    });

    it('должен обрабатывать удаление ингредиента', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [mockIngredient]
      };

      const result = reducer(
        stateWithIngredient,
        removeIngredient('ingredient-1')
      );

      expect(result.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать перемещение ингредиента', () => {
      const secondIngredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'ingredient-2'
      };

      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient, secondIngredient]
      };

      const result = reducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(result.ingredients[0].id).toBe('ingredient-2');
      expect(result.ingredients[1].id).toBe('ingredient-1');
    });

    it('должен обрабатывать очистку конструктора', () => {
      const stateWithItems = {
        bun: mockBun,
        ingredients: [mockIngredient]
      };

      const result = reducer(stateWithItems, clearConstructor());

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });
});
