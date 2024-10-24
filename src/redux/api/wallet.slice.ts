import { HttpMethod, Response } from '@/types/api.type';
import {
  AddAmountArgs,
  AddAmountResponse,
  DeductWalletAmountArgs,
  DeductWalletAmountResponse,
  GetWalletBalanceResponse,
} from '@/types/response.type';
import { RootState } from '@/types/store.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/wallet`,
    timeout: 10000, // 10 seconds
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.authToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('ngrok-skip-browser-warning', 'true');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getWalletBalance: builder.query<Response<GetWalletBalanceResponse>, void>({
      query: () => ({
        url: '/',
        method: HttpMethod.GET,
      }),
    }),
    addAmount: builder.mutation<Response<AddAmountResponse>, AddAmountArgs>({
      query: (args) => ({
        url: '/add-amount',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
    deductWalletAmount: builder.mutation<Response<DeductWalletAmountResponse>, DeductWalletAmountArgs>({
      query: (args) => ({
        url: '/deduct-amount',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
  }),
});

export const { useGetWalletBalanceQuery, useAddAmountMutation, useDeductWalletAmountMutation } = walletApi;
