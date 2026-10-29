import { z } from 'zod/v4';

export const streamingFormInputSchema = z.object({
  message: z.string().nonempty('Text message is required'),
});
