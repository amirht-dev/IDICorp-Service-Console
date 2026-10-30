import { z } from 'zod/v4';

export const echoMessageFormInputSchema = z.object({
  message: z.string().nonempty('Message is required'),
});

export type EchoMessageInput = z.infer<typeof echoMessageFormInputSchema>;

export const echoMessageSchema = z.union([
  z.object({
    type: z.string(),
  }),
  z.object({
    error: z.string(),
  }),
  z.object({
    message: z.string(),
  }),
]);
