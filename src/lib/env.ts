import { z } from 'zod/v4';

export const env = z
  .object({
    VITE_APP_URL: z.string().nonempty(),
    VITE_HTTP_API_BASE_URL: z.string().nonempty(),
    VITE_CALCULATOR_WS_URL: z.string().nonempty(),
    VITE_ECHO_WS_URL: z.string().nonempty(),
  })
  .parse(import.meta.env);
