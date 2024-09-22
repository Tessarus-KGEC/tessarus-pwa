import { PERMISSIONS } from '@/constants';

const dashboardPath = '/dashboard';
const authenticationPath = '/auth';

export enum Route {
  LOGIN = 'login',
  OTP = 'otp',
  SIGNUP = 'sign-up',
  EVENTS = 'events',
  EVENT = 'event',
  CHECKIN = 'check-in',
  WALLET = 'wallet',
  ANALYTICS = 'analytics',
  USER_MANAGEMENT = 'user-management',
  TRANSACTIONS = 'transactions',
  REGISTERED_EVENTS = `registered`,
}

export const Routes = {
  [Route.LOGIN]: {
    slug: `${authenticationPath}/${Route.LOGIN}`,
    permissions: [],
  },
  [Route.SIGNUP]: {
    slug: `${authenticationPath}/${Route.SIGNUP}`,
    permissions: [],
  },
  [Route.OTP]: {
    slug: `${authenticationPath}/${Route.OTP}`,
    permissions: [],
  },
  [Route.EVENTS]: {
    slug: `${dashboardPath}/${Route.EVENTS}`,
    permissions: [],
  },
  [Route.EVENT]: {
    slug: `${dashboardPath}/${Route.EVENT}`,
    permissions: [],
  },
  [Route.CHECKIN]: {
    slug: `${dashboardPath}/${Route.CHECKIN}`,
    permissions: [PERMISSIONS.VOLUNTEER_READONLY],
  },
  [Route.REGISTERED_EVENTS]: {
    slug: `${dashboardPath}/${Route.EVENTS}/${Route.REGISTERED_EVENTS}`,
    permissions: [PERMISSIONS.USER_READONLY],
  },
  [Route.WALLET]: {
    slug: `${dashboardPath}/${Route.WALLET}`,
    permissions: [PERMISSIONS.USER_READONLY],
  },
  [Route.ANALYTICS]: {
    slug: `${dashboardPath}/${Route.ANALYTICS}`,
    permissions: [PERMISSIONS.ADMIN_READONLY],
  },
  [Route.TRANSACTIONS]: {
    slug: `${dashboardPath}/${Route.TRANSACTIONS}`,
    permissions: [PERMISSIONS.ADMIN_READONLY, PERMISSIONS.PAYMENT_LOGS],
  },
  [Route.USER_MANAGEMENT]: {
    slug: `${dashboardPath}/${Route.USER_MANAGEMENT}`,
    permissions: [PERMISSIONS.ADMIN_READONLY],
  },
};

export enum RouteQuery {
  TAB = 'tab',
}

export enum EventTab {
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
}

export enum CheckInTab {
  SCANNER = 'scanner',
  MANUAL = 'manual',
}

export enum PaymentLogsTab {
  ALL = 'all',
  FAILED = 'failed',
}

export enum AnalyticsTab {
  EVENTS = 'events',
  PAYMENT = 'payment',
}
