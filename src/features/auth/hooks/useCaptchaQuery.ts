import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCaptcha } from '../services/captcha.service';

export const captchaQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'captcha'],
    queryFn: ({ signal }) => getCaptcha({ signal }),
    staleTime: 60 * 1000,
    retry: import.meta.env.MODE === 'test' ? false : 5,
  });

export default function useCaptchaQuery() {
  return useQuery(captchaQueryOptions());
}
