import { z } from 'zod/v4';

export const signInFormSchema = z.object({
  captcha_answer: z.string().nonempty('Captcha answer is required'),
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

export const signInInputSchema = z.object({
  ...signInFormSchema.shape,
  salt: z.string().nonempty('Salt is required'),
});
