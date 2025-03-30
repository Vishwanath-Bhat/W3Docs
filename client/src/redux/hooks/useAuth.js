// src/hooks/useAuth.js
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../slices/authSlice';

const useAuth = () => {
    const user = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch();

    const UpdateUserLogin = (username, token) => {
    dispatch(login({ username, token }));
    const jwtToken = { username, token };
localStorage.setItem('token', JSON.stringify(jwtToken));

  };

  const UpdateUserLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return { user, token , UpdateUserLogin, UpdateUserLogout };
};

export default useAuth;
