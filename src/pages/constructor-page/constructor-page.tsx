import { useSelector, useDispatch } from '../../services/store';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import {
  fetchIngredients,
  getIngredientsLoading
} from '../../services/slices/ingredients-slice';
import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIngredientsLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите космический бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
