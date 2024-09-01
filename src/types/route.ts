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
