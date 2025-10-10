import React, { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getOrderByNumber } from '../../services/slices/profile-orders-slice';
import { getIngredients } from '../../services/slices/ingredients-slice';
import styles from '../../components/app/app.module.css';

export const OrderInfo: FC<{ inModal?: boolean }> = ({ inModal = false }) => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector((state) => state.ingredients.items);
  const orderData = useSelector((state) => state.profileOrders.orderByNumber);
  const isLoading = useSelector((state) => state.profileOrders.isLoading);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch, number, ingredients.length]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return (
    <div className={styles.detailPageWrap}>
      {!inModal && (
        <div className={styles.detailHeader}>
          <h1 className='text text_type_digits-default'>
            #{String(orderInfo.number).padStart(6, '0')}
          </h1>
        </div>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
