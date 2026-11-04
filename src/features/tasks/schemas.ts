import { pickBy } from 'lodash';
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

export const tasksFiltersParamsSchema = z
  .object({
    q: z
      .string('Invalid q filter. q must be string')
      .transform((value) => value || undefined)
      .optional(),
    completed: z
      .boolean('Invalid completed filter. completed must be boolean')
      .transform(String)
      .optional(),
  })
  .transform((filters) => pickBy(filters, (value) => value));
