import { Route } from '@/types/route';

export const RoutePath = {
  [Route.LOGIN]: () => `/auth/${Route.LOGIN}`,
  [Route.OTP]: (otpToken: string) => `/auth/${Route.OTP}/${otpToken}`,
  [Route.EVENTS]: () => `/dashboard/${Route.EVENTS}`,
  [Route.EVENT]: (eventId: string) => `/dashboard/${Route.EVENTS}/${eventId}`,
};

export const PublicPath = [Route.LOGIN, Route.OTP, Route.SIGNUP, Route.EVENTS];
