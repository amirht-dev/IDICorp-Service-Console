import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCaptcha } from '../services/captcha.service';

export const captchaQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'captcha'],
    queryFn: getCaptcha,
    staleTime: 60 * 1000,
  });

export default function useCaptchaQuery() {
  return useQuery(captchaQueryOptions());
}
