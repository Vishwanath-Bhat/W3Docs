// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    userId: null,
  },
  reducers: {
    id: (state, action) => {
      state.userId = action.payload.userId
    },
    login: (state, action) => {
      state.user = action.payload.username;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout, id } = authSlice.actions;
export default authSlice.reducer;
