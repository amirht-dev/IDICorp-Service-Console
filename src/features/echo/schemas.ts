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

export const echoServerConfirmSchema = z.object({
  type: z.string(),
});

export const echoServerErrorSchema = z.object({
  error: z.string(),
});

export const echoServerResponseSchema = z.object({
  message: z.string(),
});

export const echoServerMessageSchema = z.union([
  echoServerConfirmSchema,
  echoServerErrorSchema,
  echoServerResponseSchema,
]);

export const echoClientAuthenticateSchema = z.object({
  token: z.string(),
});

export const echoClientRequestSchema = echoMessageFormInputSchema;

export const echoClientMessageSchema = z.union([
  echoClientAuthenticateSchema,
  echoClientRequestSchema,
]);
