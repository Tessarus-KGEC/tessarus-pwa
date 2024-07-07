import { StatusCode, StatusCodeValue } from './statusCode.type';

export type Response<T> =
  | {
      status: 200 | 201;
      statusMessage: StatusCodeValue;
      message: string;
      data: T;
    }
  | {
      status: Exclude<StatusCode, 200 | 201>;
      statusMessage: StatusCodeValue;
      message: string;
      error: unknown;
    };

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;
