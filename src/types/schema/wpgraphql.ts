import { z } from "zod";

const errorsSchema = z
  .array(
    z.object({
      message: z.string(),
    })
  )
  .optional();

export const loginResponseSchema = z.object({
  data: z.object({
    login: z
      .object({
        authToken: z.string(),
        user: z.object({
          id: z.string(),
          databaseId: z.number(),
          name: z.string(),
        }),
      })
      .nullable(),
  }),
  errors: errorsSchema,
});

export const userResponseSchema = z.object({
  data: z
    .object({
      user: z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .nullable(),
    })
    .optional(),
  errors: errorsSchema,
});
