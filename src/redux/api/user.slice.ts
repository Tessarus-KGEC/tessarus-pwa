import { HttpMethod, Response } from '@/types/api.type';
import {
  EventCoordinatorsResponse,
  LeaderboardContestantsQuery,
  LeaderboardContestantsResponse,
  PushSubscriptionPublicKeyResponse,
  UpdateUserDetailsArg,
  UpdateUserDetailsResponse,
  UserSelfResponse,
} from '@/types/response.type';
import { RootState } from '@/types/store.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/user`,
    timeout: 5000, // 5 seconds
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
    currentUser: builder.query<Response<UserSelfResponse>, void>({
      query: () => ({
        url: '/self',
        method: HttpMethod.GET,
      }),
    }),
    getPushSubscriptionPublicKey: builder.query<Response<PushSubscriptionPublicKeyResponse>, void>({
      query: () => ({
        url: '/notification/key',
        method: HttpMethod.GET,
      }),
    }),
    getAllEventCoordinators: builder.query<Response<EventCoordinatorsResponse[]>, void>({
      query: () => ({
        url: '/coordinators',
        method: HttpMethod.GET,
      }),
    }),
    getLeaderboardList: builder.query<Response<LeaderboardContestantsResponse>, LeaderboardContestantsQuery>({
      query: ({ page, limit }) => ({
        url: `/leaderboard?page=${page}&limit=${limit}`,
        method: HttpMethod.GET,
      }),
    }),
    updateUserDetails: builder.mutation<Response<UpdateUserDetailsResponse>, UpdateUserDetailsArg>({
      query: (args) => ({
        url: '/self',
        method: HttpMethod.PUT,
        body: args,
      }),
    }),
  }),
});

export const { useCurrentUserQuery, useGetPushSubscriptionPublicKeyQuery, useGetAllEventCoordinatorsQuery, useGetLeaderboardListQuery, useUpdateUserDetailsMutation } = userApi;
