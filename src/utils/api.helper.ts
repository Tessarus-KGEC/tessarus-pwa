/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}
/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error != null && 'message' in error && typeof (error as any).message === 'string';
}

export function isFetchBaseQueryErrorWithMessage(data: unknown) : data is { message: string } {
  return typeof data === 'object' && data != null && 'message' in data && typeof (data as any).message === 'string';
}

export function getAPIErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    if (isFetchBaseQueryErrorWithMessage(error.data)) return error.data.message;
    if (error.data) return 'error' in error ? error.error : JSON.stringify(error.data);
  }
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return 'Something went wrong';
}
