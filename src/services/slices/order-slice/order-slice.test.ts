import orderReducer, {
  addIngredient,
  removeIngredient,
  addBun,
  removeAllIngredients,
  moveIngredientDown,
  moveIngredientUp,
  initialState
} from './index';
import { TConstructorIngredient } from '@utils-types';

describe('Слайс заказа', () => {

  const mockBun: TConstructorIngredient = {
    _id: 'bun1',
    name: 'Тестовая булка',
    type: 'bun',
    price: 100,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile',
    calories: 100,
    proteins: 100,
    fat: 100,
    carbohydrates: 100,
    id: 'bun1-id'
  };

  const mockIngredient: TConstructorIngredient = {
    _id: 'ingredient1',
    name: 'Тестовый ингредиент',
    type: 'main',
    price: 50,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile',
    calories: 50,
    proteins: 50,
    fat: 50,
    carbohydrates: 50,
    id: 'ingredient1-id'
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен добавлять булку', () => {
    const state = orderReducer(initialState, addBun(mockBun));
    expect(state.buns).toEqual(mockBun);
  });

  it('должен добавлять ингредиент', () => {
    const state = orderReducer(initialState, addIngredient(mockIngredient));
    expect(state.ingredients).toContainEqual(mockIngredient);
    expect(state.ingredients).toHaveLength(1);
  });

  it('должен удалять ингредиент', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockIngredient]
    };

    const state = orderReducer(
      stateWithIngredients,
      removeIngredient('ingredient1-id')
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('должен очищать все ингредиенты', () => {
    const stateWithData = {
      buns: mockBun,
      ingredients: [mockIngredient]
    };

    const state = orderReducer(stateWithData, removeAllIngredients());
    expect(state.buns).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен перемещать ингредиент вниз', () => {
    const ingredient1: TConstructorIngredient = { ...mockIngredient, id: '1' };
    const ingredient2: TConstructorIngredient = { ...mockIngredient, id: '2' };

    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredient1, ingredient2]
    };

    const state = orderReducer(stateWithIngredients, moveIngredientDown(0));
    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });

  it('должен перемещать ингредиент вверх', () => {
    const ingredient1: TConstructorIngredient = { ...mockIngredient, id: '1' };
    const ingredient2: TConstructorIngredient = { ...mockIngredient, id: '2' };

    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredient1, ingredient2]
    };

    const state = orderReducer(stateWithIngredients, moveIngredientUp(1));
    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });
});
