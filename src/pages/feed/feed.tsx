import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrdersSelector, takeGetFeedsApi } from '../../services/feedSlice';
import { useEffect } from 'react';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  // const order: TOrder[] = [];
  const dispatch = useDispatch();
  const orders = useSelector(getOrdersSelector);

  useEffect(() => {
    dispatch(takeGetFeedsApi());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(takeGetFeedsApi());
      }}
    />
  );
};
