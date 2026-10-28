import { z } from 'zod/v4';

export const streamingFormInputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text/plain'),
    content: z.string().nonempty('Text Content is required'),
  }),
  z.object({
    type: z.literal('multipart/form-data'),
    file: z.file({
      error: ({ input }) => {
        if (input === undefined) return 'File is required';
      },
    }),
  }),
]);
