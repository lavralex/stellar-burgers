import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredients
} from '../../services/slices/burger-constructor-slice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector(getConstructorBun);
  const constructorIngredients = useSelector(getConstructorIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    if (bun) {
      counters[bun._id] = 2;
    }

    constructorIngredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
