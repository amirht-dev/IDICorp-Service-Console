import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import axios from 'axios';
import { UnauthenticatedError } from './exceptions';

export const baseApi = axios.create({
  baseURL: '/api',
});

export function getAuthApi() {
  const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!storedAccessToken) throw new UnauthenticatedError();

  const accessToken: string = JSON.parse(storedAccessToken);

  const authApi = baseApi.create({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return authApi;
}
