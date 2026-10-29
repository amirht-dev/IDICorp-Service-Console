import { z } from 'zod/v4';

export const env = z
  .object({
    VITE_HTTP_API_BASE_URL: z.string().nonempty(),
  })
  .parse(import.meta.env);
