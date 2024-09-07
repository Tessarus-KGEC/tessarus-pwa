import { HttpMethod, Response } from '@/types/api.type';
import { GetAllUAMUsersArgs } from '@/types/args.type';
import { GetAllUAMUsersResponse } from '@/types/response.type';
import { RootState } from '@/types/store.type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const uamApi = createApi({
  reducerPath: 'uamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/uam`,
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
    getUAMUsers: builder.query<Response<GetAllUAMUsersResponse>, GetAllUAMUsersArgs>({
      query: (args) => {
        const query = new URLSearchParams();
        if (args.page && args.limit) {
          query.set('page', args.page.toString());
          query.set('limit', args.limit.toString());
        }
        if (args.search) {
          query.set('search', args.search);
        }
        if (args.fromKGEC) {
          query.set('fromKGEC', 'true');
        }
        if (args.permissions) {
          query.set('permissions', args.permissions.join(','));
        }
        return {
          url: `/users?${query.toString()}`,
          method: HttpMethod.GET,
        };
      },
    }),
  }),
});

export const { useGetUAMUsersQuery } = uamApi;
