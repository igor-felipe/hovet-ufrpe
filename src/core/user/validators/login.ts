import { z } from "zod";
import { user, User } from "./user";
import { toTaskEither } from "@/core/helpers";

export const loginInput = user.pick({
  email: true,
  password: true,
});

export const loginValidator = toTaskEither(loginInput);

export type LoginInput = z.infer<typeof loginInput>;
export type LoginOutput = string;

export type LoginInDbInput = Pick<User, "email">;
export type LoginInDbOutput = User;