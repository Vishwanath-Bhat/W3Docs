// src/hooks/useAuth.js
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, id } from '../slices/authSlice';

const useAuth = () => {
    const user = useSelector((state) => state.auth.user)
    const userId = useSelector((state) => state.auth.userId)
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

  const UpdateUserID = (userId) => {
    dispatch(id({userId}));
  }

  return { userId, user, token , UpdateUserLogin, UpdateUserLogout, UpdateUserID };
};

export default useAuth;
