import React, { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients-slice';
import { useParams } from 'react-router-dom';
import styles from '../../components/app/app.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients.items);
  const isLoading = useSelector((state) => state.ingredients.isLoading);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  return (
    <div className={styles.detailPageWrap}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
