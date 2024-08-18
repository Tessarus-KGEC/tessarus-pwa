import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/auth.slice';

import { eventApi } from './api/event.slice';
import { userApi } from './api/user.slice';
import authReducer from './reducers/auth.reducer';
import routeReducer from './reducers/route.reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    route: routeReducer,
    // api reducers
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(authApi.middleware, userApi.middleware, eventApi.middleware),
});

setupListeners(store.dispatch);
