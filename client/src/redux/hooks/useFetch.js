// src/hooks/useFetch.js
import { useSelector } from 'react-redux';
import axios from 'axios';

const useFetch = () => {
  const token = useSelector((state) => state.auth.token);

  const fetchWithAuth = async (url, method = 'GET', data = null) => {
    try {
      const response = await axios({
        url,
        method,
        headers: { Authorization: `Bearer ${token}` },
        data,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return fetchWithAuth;
};

export default useFetch;
