import z from 'zod/v4';

export const calculatorOperatorSchema = z.enum([
  'add',
  'subtract',
  'multiply',
  'divide',
]);

export type CalculatorOperator = z.infer<typeof calculatorOperatorSchema>;

export const calculatorFormInputSchema = z
  .object({
    operation: calculatorOperatorSchema,
    numbers: z
      .array(z.number())
      .nonempty('Numbers are required')
      .min(2, 'at least two numbers are required')
      .max(100, 'Only 100 numbers are allowed'),
  })
  .superRefine(({ operation, numbers }, ctx) => {
    if (operation === 'divide' && numbers.slice(1).some((num) => num === 0)) {
      ctx.addIssue({
        code: 'invalid_value',
        path: ['numbers'],
        values: numbers,
        message: 'value can not be divided by zero',
      });

      return z.NEVER;
    }
  });

export type CalculatorInput = z.infer<typeof calculatorFormInputSchema>;

export const calculatorMessageSchema = z.union([
  z.object({
    type: z.string(),
  }),
  z.object({
    error: z.string(),
  }),
  z.object({
    result: z.number(),
  }),
]);
