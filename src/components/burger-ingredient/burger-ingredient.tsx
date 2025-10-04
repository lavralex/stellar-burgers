import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import {
  addBun,
  addIngredient
} from '../../services/slices/burger-constructor-slice';
import { nanoid } from 'nanoid';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      const ingredientWithId = { ...ingredient, id: nanoid() };

      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredientWithId));
      } else {
        dispatch(addIngredient(ingredientWithId));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
