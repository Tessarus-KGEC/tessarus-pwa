import { HttpMethod, Response } from '@/types/api.type';
import { LoginArgs, VerifyOTPArgs } from '@/types/args.type';
import { LoginResponse, SignupUserArgs, VerifyOTPResponse, VerifyUniversityRollArgs, VerifyUniversityRollResponse } from '@/types/response.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
    timeout: 10000, // 10 seconds
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Response<LoginResponse>, LoginArgs>({
      query: ({ email }) => ({
        url: '/login',
        method: HttpMethod.POST,
        body: { email },
      }),
    }),
    verfiyOTP: builder.mutation<Response<VerifyOTPResponse>, VerifyOTPArgs>({
      query: (args) => ({
        url: '/verify-otp',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
    verifyUniversityRoll: builder.mutation<Response<VerifyUniversityRollResponse>, VerifyUniversityRollArgs>({
      query: (args) => ({
        url: '/verify-university-roll',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
    signUp: builder.mutation<Response<void>, SignupUserArgs>({
      query: (args) => ({
        url: '/sign-up',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
  }),
});

export const { useLoginMutation, useVerfiyOTPMutation, useSignUpMutation, useVerifyUniversityRollMutation } = authApi;
