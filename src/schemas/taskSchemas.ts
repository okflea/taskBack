import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title must be at least 1 character long' })
    .max(100, { message: 'Title must be at most 100 characters long' }),
  description: z.string()
    .max(500, { message: 'Description must be at most 500 characters long' })
    .optional(),
  // column: z.string()
  //   .min(1, { message: 'Column must be at least 1 character long' })
  //   .max(50, { message: 'Column must be at most 50 characters long' }),
});

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title must be at least 1 character long' })
    .max(100, { message: 'Title must be at most 100 characters long' })
    .optional(),
  description: z.string()
    .max(500, { message: 'Description must be at most 500 characters long' })
    .optional(),
  column: z.string()
    .min(1, { message: 'Column must be at least 1 character long' })
    .max(50, { message: 'Column must be at most 50 characters long' })
    .optional(),
  order: z.number().optional()
});
