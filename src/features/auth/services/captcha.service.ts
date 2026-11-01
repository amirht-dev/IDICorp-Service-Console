import { baseApi } from '@/lib/axios';
import type { CaptchaResponse } from '../types';

export async function getCaptcha(options?: { signal?: AbortSignal }) {
  const response = await baseApi.get<CaptchaResponse>('/auth/login', {
    signal: options?.signal,
    timeout: 10_000,
  });
  return response.data;
}
