import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: localStorage.getItem('isAuthenticated'),
    user: localStorage.getItem('user')|| null,
    role: localStorage.getItem('role') || '',
    access: localStorage.getItem('access') || '',
    refresh: localStorage.getItem('refresh') || '',
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = '';
      state.access = '';
      state.refresh = '';

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
