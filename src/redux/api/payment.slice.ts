import { HttpMethod, Response } from '@/types/api.type';
import { CreatePaymentOrderArgs } from '@/types/args.type';
import { CreatePaymentOrderResponse } from '@/types/response.type';
import { RootState } from '@/types/store.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/payment`,
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
    createPaymentOrder: builder.mutation<Response<CreatePaymentOrderResponse>, CreatePaymentOrderArgs>({
      query: (args) => ({
        url: '/create-payment',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
  }),
});

export const { useCreatePaymentOrderMutation } = paymentApi;
