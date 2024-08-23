import { HttpMethod, Response } from '@/types/api.type';
import { CreateEventResponse, GetAllEventsResponse } from '@/types/response.type';
import { RootState } from '@/types/store.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateEventArgs } from '../../types/args.type';

export const eventApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/events`,
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
    getAllEvents: builder.query<Response<GetAllEventsResponse>, void>({
      query: () => ({
        url: '/',
        method: HttpMethod.GET,
      }),
    }),
    createEvent: builder.mutation<Response<CreateEventResponse>, CreateEventArgs>({
      query: (args) => ({
        url: '/',
        method: HttpMethod.POST,
        body: args,
      }),
    }),
  }),
});

export const { useGetAllEventsQuery, useCreateEventMutation } = eventApi;
