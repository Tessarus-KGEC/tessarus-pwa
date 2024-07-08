/* eslint-disable no-param-reassign */
import { AnalyticsTab, CheckInTab, EventTab, PaymentLogsTab, RouteQuery } from '@/types/route';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface Query {
  [RouteQuery.TAB]: EventTab | AnalyticsTab | CheckInTab | PaymentLogsTab;
}

interface RouteState {
  activeRoute: string;
  routeQuery: Query | null;
}

const initialState = {
  activeRoute: '',
  routeQuery: {
    [RouteQuery.TAB]: EventTab.ONGOING,
  },
} satisfies RouteState as RouteState;

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setActiveRoute(state, action: PayloadAction<string>) {
      state.activeRoute = action.payload;
    },
    setRouteQuery(state, action: PayloadAction<Query | null>) {
      if (!action.payload) {
        state.routeQuery = null;
        return;
      }
      state.routeQuery = {
        ...state.routeQuery,
        ...action.payload,
      };
    },
  },
});

export const { setActiveRoute, setRouteQuery } = routeSlice.actions;
export default routeSlice.reducer;
