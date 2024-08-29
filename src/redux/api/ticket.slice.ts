import { HttpMethod, Response } from '@/types/api.type';
import { BookTicketArgs } from '@/types/args.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BookTicketResponse } from '../../types/response.type';
import { RootState } from '../../types/store.type';

export const ticketApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/tickets`,
    timeout: 10000, // 10 seconds
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
    bookTicket: builder.mutation<Response<BookTicketResponse>, BookTicketArgs>({
      query: (args) => ({
        url: '/create',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
  }),
});

export const { useBookTicketMutation } = ticketApi;
