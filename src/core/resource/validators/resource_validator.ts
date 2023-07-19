import { z } from "zod";

export const resource = z
  .object({
    id: z.number().nonnegative(),
    name: z.string().nonempty(),
  })
  .strict();

export type Resource = z.infer<typeof resource>;
