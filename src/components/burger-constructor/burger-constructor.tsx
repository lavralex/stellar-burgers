import { useSelector, useDispatch } from '../../services/store';
import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  clearOrder,
  getOrderData,
  getOrderLoading
} from '../../services/slices/create-order-slice';
import {
  clearConstructor,
  getConstructorBun,
  getConstructorIngredients
} from '../../services/slices/burger-constructor-slice';
import { getUserData } from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(getConstructorBun);
  const ingredients = useSelector(getConstructorIngredients);
  const orderData = useSelector(getOrderData);
  const isLoading = useSelector(getOrderLoading);
  const user = useSelector(getUserData);

  const constructorItems = {
    bun,
    ingredients
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total, item) => total + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bun || ingredients.length === 0) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isLoading}
      constructorItems={constructorItems}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
