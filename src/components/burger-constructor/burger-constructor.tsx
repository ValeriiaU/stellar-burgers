import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  clearConstructor
} from '../../services/constructorSlice';
import {
  getOrderRequest,
  getOrderBurgerApi,
  getOrderModalData,
  closeModal,
  cancelOrder
} from '../../services/makeOrderSlice';
import { getIsAuthenticated } from '../../services/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const constructorItems = useSelector(getConstructorItems);
  const orderModalData = useSelector(getOrderModalData);
  const orderRequest = useSelector(getOrderRequest);
  const selectorisAuthenticated = useSelector(getIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const justBun = [constructorItems.bun?._id];
  const allIngrediens = constructorItems.ingredients.map((one) => one._id);
  const resault = [...justBun, ...allIngrediens].filter(
    (id): id is string => !!id
  );

  console.log(resault);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!selectorisAuthenticated) {
      dispatch(cancelOrder());
      navigate('/login');
      return;
    }
    dispatch(getOrderBurgerApi(resault));
    dispatch(clearConstructor());
  };
  const closeOrderModal = () => {
    dispatch(closeModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingridient: TConstructorIngredient) =>
          sum + ingridient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
