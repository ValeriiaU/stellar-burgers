import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { IngredientDetails } from '../ingredient-details';
import { ProtectedRoute } from '../protected-component';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { AppHeader, Modal, OrderInfo } from '@components';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { checkGetUserApi } from '../../services/userSlice';
import { getIngredients } from '../../services/ingredientsSlice';
import { takeGetFeedsApi, takeGetOrdersApi } from '../../services/feedSlice';
import { getCookie } from '../../utils/cookie';

const App = () => {
  const naigate = useNavigate();
  const location = useLocation();
  const locationStateOrder = location.state?.background;
  const locationStateIngredient = location.state?.background;
  const locationStateOrderInfo = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkGetUserApi());
  }, []);

  useEffect(() => {
    dispatch(getIngredients());
  }, []);

  useEffect(() => {
    dispatch(takeGetFeedsApi());
  }, [dispatch]);

  useEffect(() => {
    dispatch(takeGetOrdersApi());
  }, [dispatch]);

  console.log(getCookie('accessToken'));

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes
        location={
          locationStateIngredient ||
          locationStateOrderInfo ||
          locationStateOrder ||
          location
        }
      >
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {locationStateOrder && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={() => naigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
      {locationStateIngredient && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={() => naigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
      {locationStateOrderInfo && (
        <Routes>
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='' onClose={() => naigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
