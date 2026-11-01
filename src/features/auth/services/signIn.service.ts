import { baseApi } from '@/lib/axios';
import type { AxiosResponseDefault } from 'axios';
import type { SignInInput, SignInResponse } from '../types';

export async function signIn(
  { username, password, salt, captcha_answer }: SignInInput,
  options?: { signal?: AbortSignal },
) {
  const response = await baseApi.post<
    SignInResponse,
    AxiosResponseDefault,
    SignInInput
  >(
    '/auth/login',
    { username, password, salt, captcha_answer },
    { withCredentials: true, timeout: 10_000, signal: options?.signal },
  );
  return response.data;
}
