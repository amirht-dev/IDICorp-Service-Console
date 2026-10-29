import { z } from 'zod/v4';

export const createTaskInputSchema = z.object({
  title: z
    .string()
    .nonempty('Title is required')
    .max(120, 'Title must be up to 120 characters'),
  description: z.string().max(2000, 'Title must be up to 2000 characters'),
  completed: z.boolean().default(false),
});

export const updateTaskInputSchema = createTaskInputSchema.partial();
