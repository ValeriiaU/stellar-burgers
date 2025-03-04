import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getMyOrders, takeGetOrdersApi } from '../../services/feedSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(takeGetOrdersApi());
  // }, [dispatch]);

  const orders = useSelector(getMyOrders);

  return <ProfileOrdersUI orders={orders} />;
};
