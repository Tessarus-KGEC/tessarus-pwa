/* eslint-disable no-param-reassign */
import { User } from '@/types/app.type';
import { removeLocalStorageItem, setLocalStorageItem } from '@/utils/localStorage.helper';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  authToken: string | null;
  user: User | null;
  email: string;
}

const initialState = {
  isLoggedIn: false,
  authToken: null,
  user: null,
  email: '',
} satisfies AuthState as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.authToken = action.payload;
      if (action.payload) {
        setLocalStorageItem('accessToken', action.payload);
      } else {
        removeLocalStorageItem('accessToken');
      }
    },
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.authToken = null;
      state.user = null;
      removeLocalStorageItem('accessToken');
    },
  },
});

export const {
  setIsLoggedIn, setToken, setCurrentUser, logout, setUserEmail,
} = authSlice.actions;
export default authSlice.reducer;
