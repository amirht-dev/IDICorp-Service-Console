import { baseApi } from '@/lib/axios';
import type { AxiosResponseDefault } from 'axios';
import type { SignInInput, SignInResponse } from '../types';

export async function signIn({
  username,
  password,
  salt,
  captcha_answer,
}: SignInInput) {
  const response = await baseApi.post<
    SignInResponse,
    AxiosResponseDefault,
    SignInInput
  >(
    '/auth/login',
    { username, password, salt, captcha_answer },
    { withCredentials: true },
  );

  return response.data;
}
