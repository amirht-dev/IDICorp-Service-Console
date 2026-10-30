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

  authApi.interceptors.response.use(null, (error) => {
    if (axios.isAxiosError(error) && error.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      dispatchEvent(
        new CustomEvent('localstorage:change', {
          detail: {
            key: ACCESS_TOKEN_STORAGE_KEY,
            value: null,
          },
        }),
      );
    }
    throw error;
  });

  return authApi;
}
