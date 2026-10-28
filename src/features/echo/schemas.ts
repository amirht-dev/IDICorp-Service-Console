import { z } from 'zod/v4';

export const echoMessageFormInputSchema = z.object({
  message: z.string().nonempty('Message is required'),
});
