import { ACCESS_TOKEN_STORAGE_KEY } from './constants';

export function readAccessToken() {
  const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (storedAccessToken == null) return null;

  return JSON.parse(storedAccessToken) as string;
}
