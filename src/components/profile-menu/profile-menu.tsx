import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getData, getLogoutApi } from '../../services/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getData);

  const handleLogout = () => {
    if (user) {
      dispatch(getLogoutApi());
      navigate('/login');
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
