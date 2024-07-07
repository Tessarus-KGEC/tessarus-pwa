/* eslint-disable import/no-cycle */
import { authApi } from '@/api/auth.slice';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { userApi } from '@/api/user.slice';
import authReducer from './reducers/auth.reducer';
import routeReducer from './reducers/route.reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    route: routeReducer,
    // api reducers
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(
    authApi.middleware,
    userApi.middleware,
  ),
});

setupListeners(store.dispatch);
