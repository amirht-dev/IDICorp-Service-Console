import { ACCESS_TOKEN_STORAGE_KEY } from '@/features/auth/constants';
import axios from 'axios';
import { env } from './env';

export const baseApi = axios.create({ baseURL: env.VITE_HTTP_API_BASE_URL });

export function getAuthApi() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!accessToken) return null;

  const authApi = baseApi.create({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return authApi;
}
