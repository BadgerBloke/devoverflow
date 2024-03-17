import z from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  content: z.string().min(100),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1)
    .max(3)
    .refine((values) => new Set(values).size === values.length, {
      message: "Tags must be unique",
    }),
});

export type QuestionType = z.infer<typeof QuestionSchema>;

export const AnswerSchema = z.object({
  answer: z.string().min(100).max(5000),
});

export type AnswerType = z.infer<typeof AnswerSchema>;
