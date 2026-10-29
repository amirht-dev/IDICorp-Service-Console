import type { z } from 'zod/v4';
import type { signInInputSchema } from './schemas';

export type CaptchaResponse = {
  captcha: string;
  salt: string;
};

export type SignInResponse = {
  access_token: string;
  token_type: 'bearer';
};

export type SignInInput = z.infer<typeof signInInputSchema>;
