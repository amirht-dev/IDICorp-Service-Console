import { handleApiError } from '@/lib/errors';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCaptcha } from '../services/captcha.service';

export const captchaQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'captcha'],
    queryFn: ({ signal }) => getCaptcha({ signal }),
    staleTime: 60 * 1000,
    retry(failureCount, error) {
      if (import.meta.env.MODE === 'test') return false;
      const err = handleApiError(error);
      if (err.type === 'timeout' || err.type === 'cancelled') return false;
      if (failureCount > 3) return false;
      return true;
    },
  });

export default function useCaptchaQuery() {
  return useQuery(captchaQueryOptions());
}
