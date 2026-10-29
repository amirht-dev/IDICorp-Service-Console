import { baseApi } from '@/lib/axios';
import type { CaptchaResponse } from '../types';

export async function getCaptcha() {
  const response = await baseApi.get<CaptchaResponse>('/api/auth/login');

  return response.data;
}
