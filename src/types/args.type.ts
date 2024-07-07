export interface LoginArgs {
  email: string;
}

export interface VerifyOTPArgs {
  email: string;
  otp: string;
  otp_token: string;
}
