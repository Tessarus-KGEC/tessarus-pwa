import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/auth.slice';

import { eventApi } from './api/event.slice';
import { paymentApi } from './api/payment.slice';
import { ticketApi } from './api/ticket.slice';
import { userApi } from './api/user.slice';
import { uamApi } from './api/userManagement.slice';
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
    [ticketApi.reducerPath]: ticketApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [uamApi.reducerPath]: uamApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      userApi.middleware,
      eventApi.middleware,
      ticketApi.middleware,
      paymentApi.middleware,
      uamApi.middleware,
    ),
});

setupListeners(store.dispatch);
