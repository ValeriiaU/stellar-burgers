import { FC, useMemo, useState, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredientsData } from '../../services/ingredientsSlice';
import { useLocation, useParams } from 'react-router-dom';
import {
  getOrderByNumber,
  getOrder,
  getMyOrderByNumber
} from '../../services/feedSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const location = useLocation();
  const { number: orderNumber } = useParams();

  const orderInformstion = () => {
    if (location.pathname === `/feed/${orderNumber}`) {
      dispatch(getOrderByNumber(Number(orderNumber)));
      const order = useSelector(getOrder);
      return order;
    } else {
      dispatch(getMyOrderByNumber(Number(orderNumber)));
      const myOrder = useSelector(getOrder);
      return myOrder;
    }
  };

  const orderData = orderInformstion();

  const ingredients = useSelector(getIngredientsData);

  // const ingredientS: TIngredient[] = [];

  /* Готовим данные для отображения */
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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
