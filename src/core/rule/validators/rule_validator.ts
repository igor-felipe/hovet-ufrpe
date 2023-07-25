import { z } from "zod";

export const permission = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
} as const;

export const rule = z.object({
  id: z.number().nonnegative(),
  permission: z.enum([permission.READ, permission.WRITE, permission.DELETE]),
  userId: z.string().nonempty(),
  resourceName: z.string().nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Rule = z.infer<typeof rule>;
export type Permission = (typeof permission)[keyof typeof permission];
