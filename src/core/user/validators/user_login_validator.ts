import { z } from "zod";
import { user, User } from "./user_validator";
import { toTaskEither } from "@/core/helpers";
import { rule } from "@/core/rule/validators/rule_validator";

const loginInput = user.pick({
  email: true,
  password: true,
});

const loginInDbOutput = z.object({
  user: user.pick({ id: true, password: true, status: true }),
  rules: z.array(rule.pick({ permission: true, resourceName: true })),
});

export const loginValidator = toTaskEither(loginInput);

export type LoginInput = z.infer<typeof loginInput>;
export type LoginOutput = string;
export type LoginInDbInput = Pick<User, "email">;
export type LoginInDbOutput = z.infer<typeof loginInDbOutput>;
