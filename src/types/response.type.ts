import { User } from './app.type';

export interface LoginResponse {
  otp_token: string;
  expiryTime: number;
}

export interface VerifyOTPResponse {
  accessToken: string;
}

export interface UserSelfResponse extends User {}

export interface PushSubscriptionPublicKeyResponse {
  publicKey: string;
}
