import { Navigate, useLocation } from 'react-router-dom';
import { ProtectedRouteProps } from '../../utils/types';
import { useSelector } from '../../services/store';
import { getIsAuthChecked, getIsAuthenticated } from '../../services/userSlice';
import { Preloader } from '@ui';

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const selectorAuthChecked = useSelector(getIsAuthChecked);
  const selectorIsAuthenticated = useSelector(getIsAuthenticated);
  const location = useLocation();

  if (!selectorAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && selectorIsAuthenticated) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !selectorIsAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return <>{children}</>;
};
